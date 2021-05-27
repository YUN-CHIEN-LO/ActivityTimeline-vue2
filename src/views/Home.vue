<template>
  <div class="home">
    <div class="row sticky-top ">
      <div class="col-sm-4"><button class="btn btn-primary shadow" @click="sort('asc')">升幂</button></div>
      <div class="col-sm-4">
        <button class="btn btn-primary shadow" @click="sort('desc')">降幂</button>
      </div>
      <div class="col-sm-4">
        <button class="btn btn-warning shadow" @click="$bvModal.show(addModalOptions.id)">新增</button>
      </div>
    </div>
    <div class="row">
      <ActivityTimeline
        ref="ActivityTimeline"
        class="col-sm-12"
        :options="timelineOptions"
        @onEdit="onEdit"
        @onDelete="onDelete"
      ></ActivityTimeline>
    </div>

    <EditDialog :options="addModalOptions" @ReturnNewData="addNewData"></EditDialog>
    <EditDialog :options="editModalOptions" @ReturnNewData="editNewData"></EditDialog>
    <AlertDialog :options="deleteModalOptions" @ReturnDeleteId="deleteDataByID"></AlertDialog>
  </div>
</template>

<script>
// @ is an alias to /src
import ActivityTimeline from '@/components/ActivityTimeline.vue';
import EditDialog from '@/components/dialogs/EditDialog.vue';
import AlertDialog from '@/components/dialogs/AlertDialog.vue';

export default {
  // 組件名稱
  name: 'Home',

  // 引入子組件
  components: {
    // 時間軸
    ActivityTimeline: ActivityTimeline,

    // 編輯彈窗
    EditDialog: EditDialog,

    // 刪除彈窗
    AlertDialog: AlertDialog,
  },

  //#region === DATA ===
  data() {
    // 時間軸options
    let timelineOptions = {
      // 一次顯示多少筆資料
      perItem: 4,
      // 外觀設定
      lables: {
        loadMoreText: '載入更多',
        edit: '編輯',
        delete: 'X',
      },
      // 傳入資料
      data: [],
    };

    // 新增彈窗表單選項
    let addModalOptions = {
      id: 'addModal',
      title: '新增',
      mode: 'add',
      okTitle: '儲存',
      cancelTitle: '取消',
      headerClass: 'even',
      labels: {
        title: '事件標題',
        name: '事件負責人',
        email: '聯絡信箱',
        bref: '事件簡述',
      },
      invalidFeedback: {
        title: '事件標題不得為空。',
        name: '事件負責人不得為空。',
        email: '聯絡信箱格式有誤。',
      },
      editTarget: null,
    };

    // 編輯彈窗表單選項
    let editModalOptions = {
      id: 'editModal',
      title: '編輯',
      mode: 'edit',
      okTitle: '儲存',
      cancelTitle: '取消',
      headerClass: '',
      labels: {
        title: '事件標題',
        name: '事件負責人',
        email: '聯絡信箱',
        bref: '事件簡述',
      },
      invalidFeedback: {
        title: '事件標題不得為空。',
        name: '事件負責人不得為空。',
        email: '聯絡信箱格式有誤。',
      },
      editTarget: null,
    };

    let deleteModalOptions = {
      id: 'deleteModal',
      title: '刪除',
      mode: 'delete',
      okTitle: '刪除',
      cancelTitle: '取消',
      okVariant: 'danger',
      body: '',
      targetId: '',
    };

    let _url = '';

    // 回傳
    return {
      timelineOptions,
      addModalOptions,
      editModalOptions,
      deleteModalOptions,
      _url,
    };
  },
  //#endregion
  mounted: function () {
    this._url = '/activity/record';
    let _url = this._url;
    this.axios.get(_url).then((res) => {
      this.timelineOptions.data = res.data.data;
      this.$refs.ActivityTimeline.setOpt(this.timelineOptions);
    });
  },

  //#region === METHODS ===
  methods: {
    //#region --- Callback ---
    onEdit(id) {
      this.timelineOptions.data.forEach((x, i) => {
        if (x.id == id) {
          this.editModalOptions.editTarget = x;
          if (i % 2 == 0) this.editModalOptions.headerClass = 'odd';
          else this.editModalOptions.headerClass = 'even';
        }
      });
      this.$bvModal.show(this.editModalOptions.id);
    },
    onDelete(id) {
      this.timelineOptions.data.forEach((x) => {
        if (x.id == id) {
          this.deleteModalOptions.body = `確定要刪除編號${id}筆資料?`;
          this.deleteModalOptions.targetId = id;
          this.$bvModal.show(this.deleteModalOptions.id);
        }
      });
    },

    //#endregion

    /**
     * 排序
     */
    sort(type) {
      // 時間軸套件方法
      this.$refs.ActivityTimeline.sort(type);
    },

    /**
     * 新增一筆資料
     */
    addNewData(data) {
      // 時間軸套件方法
      let _this = this.$refs.ActivityTimeline;
      let url = this._url;
      //post data
      this.axios
        .post(url, {
          title: data.title,
          name: data.name,
          datetime: data.datetime,
          email: data.email,
          bref: data.bref,
        })
        .then(function (response) {
          //add
          _this.addData(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    editNewData(data) {
      // 時間軸套件方法
      let _this = this.$refs.ActivityTimeline;
      let url = this._url;
      // put data
      this.axios
        .put(url + '/' + data.id, {
          title: data.title,
          name: data.name,
          email: data.email,
          bref: data.bref,
        })
        .then(function (response) {
          if (response.status && response.status === 200) {
            // edit with new data
            _this.updateData(response.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    deleteDataByID(id) {
      let _this = this.$refs.ActivityTimeline;
      let url = this._url;

      // delete data
      this.axios
        .delete(url + '/' + id)
        .then(function (response) {
          if (response.status && response.status === 200) {
            // delete target by id
            _this.deleteData(id);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  //#endregion
};
</script>

<style lang="scss" scoped>
.home {
  width: 80%;
  min-width: 512px;
  margin-right: auto;
  margin-left: auto;
  & .btn {
    width: 100%;
    margin: 10px 0px;
  }
  & .row {
    margin: 20px 0px;
  }
}
</style>
