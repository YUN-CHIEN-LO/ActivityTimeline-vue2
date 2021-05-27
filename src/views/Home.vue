<template>
  <div class="home">
    <div class="row sticky-top">
      <div class="col-sm-4">
        <button class="btn btn-primary shadow" @click="sort('asc')">升幂</button>
      </div>
      <div class="col-sm-4">
        <button class="btn btn-primary shadow" @click="sort('desc')">降幂</button>
      </div>
      <div class="col-sm-4">
        <button class="btn btn-warning shadow" @click="$bvModal.show(addModalOptions.id)">
          新增
        </button>
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
      // DOM Id
      id: 'addModal',
      // 模式
      mode: 'add',
      // Modal設定
      title: '新增',
      okTitle: '儲存',
      cancelTitle: '取消',
      okVariant: 'dark',
      cancelVariant: 'outline-dark',
      headerClass: 'even',
      // 自訂label
      labels: {
        title: '事件標題',
        name: '事件負責人',
        email: '聯絡信箱',
        bref: '事件簡述',
      },
      // 驗證錯誤訊息
      invalidFeedback: {
        title: '事件標題不得為空。',
        name: '事件負責人不得為空。',
        email: '聯絡信箱格式有誤。',
      },
      // 編輯對象
      editTarget: null,
    };

    // 編輯彈窗表單選項
    let editModalOptions = {
      // DOM Id
      id: 'editModal',
      // 模式
      mode: 'edit',
      // Modal設定
      title: '編輯',
      okTitle: '儲存',
      cancelTitle: '取消',
      okVariant: 'dark',
      cancelVariant: 'outline-dark',
      headerClass: '',
      // 自訂label
      labels: {
        title: '事件標題',
        name: '事件負責人',
        email: '聯絡信箱',
        bref: '事件簡述',
      },
      // 驗證錯誤訊息
      invalidFeedback: {
        title: '事件標題不得為空。',
        name: '事件負責人不得為空。',
        email: '聯絡信箱格式有誤。',
      },
      // 編輯對象
      editTarget: null,
    };

    // 刪除彈窗表單選項
    let deleteModalOptions = {
      // DOM Id
      id: 'deleteModal',
      // 模式
      mode: 'delete',
      // Modal設定
      title: '刪除',
      okTitle: '刪除',
      cancelTitle: '取消',
      okVariant: 'danger',
      body: '',
      targetId: '',
    };

    // API
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
  //#region === HOOKS ===
  mounted: function () {
    // 指定API url
    this._url = '/activity/record';
    let _url = this._url;

    // 取得所有資料
    this.axios.get(_url).then((res) => {
      this.timelineOptions.data = res.data.data;
      this.$refs.ActivityTimeline.setOpt(this.timelineOptions);
    });
  },
  //#endregion
  //#region === METHODS ===
  methods: {
    // --- Callback ---

    /**
     * 編輯
     * @param {String} id
     */
    onEdit(id) {
      this.timelineOptions.data.forEach((x, i) => {
        if (x.id == id) {
          // 帶入編輯前的資料
          this.editModalOptions.editTarget = x;

          // 判斷帶入奇數還是偶數項目的底色
          if (i % 2 == 0) this.editModalOptions.headerClass = 'odd';
          else this.editModalOptions.headerClass = 'even';
        }
      });

      // 顯示彈窗
      this.$bvModal.show(this.editModalOptions.id);
    },

    /**
     * 刪除
     * @param {String} id
     */
    onDelete(id) {
      this.timelineOptions.data.forEach((x) => {
        if (x.id == id) {
          // 帶入Modal message
          this.deleteModalOptions.body = `確定要刪除編號${id}筆資料?`;
          // 帶入要刪除的id
          this.deleteModalOptions.targetId = id;

          // 顯示彈窗
          this.$bvModal.show(this.deleteModalOptions.id);
        }
      });
    },

    /**
     * 排序
     */
    sort(type) {
      // 時間軸套件方法
      this.$refs.ActivityTimeline.sort(type);
    },

    /**
     * 新增一筆資料
     * @param {Object} data
     */
    addNewData(data) {
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
          if (response.status && response.status === 200) {
            // 時間軸套件方法
            _this.addData(response.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    /**
     * 編輯一筆資料
     * @param {Object} data
     */
    editNewData(data) {
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
            // 時間軸套件方法
            _this.updateData(response.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    /**
     * 刪除一筆資料
     * @param {String} Id
     */
    deleteDataByID(id) {
      let _this = this.$refs.ActivityTimeline;
      let url = this._url;

      // delete data
      this.axios
        .delete(url + '/' + id)
        .then(function (response) {
          if (response.status && response.status === 200) {
            // 時間軸套件方法
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
