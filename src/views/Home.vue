<template>
  <div class="home">
    <div class="row">
      <div class="col-sm-4"><button class="btn btn-primary" @click="sort('asc')">升幂</button></div>
      <div class="col-sm-4">
        <button class="btn btn-primary" @click="sort('desc')">降幂</button>
      </div>
      <div class="col-sm-4">
        <button class="btn btn-warning" @click="$bvModal.show(addModalOptions.id)">新增</button>
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
      data: [],
      // 傳入資料
      // data: [
      //   {
      //     id: '1',
      //     title: 'sdf',
      //     datetime: '2021/03/30',
      //     name: 'Alexandra Jast',
      //     email: 'Delpha.Ratke@yahoo.com',
      //     bref: 'Et sed enim qui in id cupiditate eveniet quo sint.',
      //   },
      //   {
      //     id: '2',
      //     title: 'error-quod-ducimus',
      //     datetime: '2021/03/04',
      //     name: 'Mrs. Jo Satterfield',
      //     email: 'Noemi_Vandervort@yahoo.com',
      //     bref: 'Odit ut quaerat voluptatem provident ullam hic.',
      //   },
      //   {
      //     id: '3',
      //     title: 'nam-enim-quam',
      //     datetime: '2021/03/12',
      //     name: 'Brett Nikolaus',
      //     email: 'Earnest.Conroy94@gmail.com',
      //     bref: 'Et id voluptatem iusto a laboriosam fuga.',
      //   },
      //   {
      //     id: '4',
      //     title: 'ea-laboriosam-quas',
      //     datetime: '2021/03/03',
      //     name: 'Josefina Simonis',
      //     email: 'Abigail5@hotmail.com',
      //     bref: 'Sint recusandae hic et tempore.',
      //   },
      //   {
      //     id: '5',
      //     title: 'aperiam-autem-dolores',
      //     datetime: '2021/03/10',
      //     name: 'Jonathon Wehner',
      //     email: 'Trent_Bernhard@hotmail.com',
      //     bref: 'Laboriosam incidunt molestiae omnis assumenda et perspiciatis dolore.',
      //   },
      //   {
      //     id: '11',
      //     title: 'minus-non-rerum',
      //     datetime: '2021/03/07',
      //     name: 'Jana Mayer',
      //     email: 'Declan98@gmail.com',
      //     bref: 'Molestiae iusto vero adipisci deserunt dolorem et voluptas aspernatur maiores.',
      //   },
      //   {
      //     id: '12',
      //     title: 'magni-qui-quod',
      //     datetime: '2021/03/28',
      //     name: 'Ernesto Rau',
      //     email: 'Danial14@hotmail.com',
      //     bref: 'Provident dolorem nulla aut ut dicta repellat et.',
      //   },
      //   {
      //     id: '13',
      //     title: 'quia-qui-ducimus',
      //     datetime: '2021/03/08',
      //     name: 'Rickey Gulgowski',
      //     email: 'Delphia_Lynch@yahoo.com',
      //     bref: 'Dolorem quis culpa esse nulla.',
      //   },
      //   {
      //     id: '14',
      //     title: 'minus-eaque-ullam',
      //     datetime: '2021/03/27',
      //     name: 'Sandra Wehner',
      //     email: 'Mckenna42@hotmail.com',
      //     bref: 'Aut quia enim et dicta.',
      //   },
      //   {
      //     id: '15',
      //     title: 'fuga-dolorem-vero',
      //     datetime: '2021/03/25',
      //     name: 'Miss Glenn Bahringer',
      //     email: 'Loraine_Donnelly@yahoo.com',
      //     bref: 'Qui qui placeat optio.',
      //   },
      //   {
      //     id: '6',
      //     title: 'autem-omnis-aut',
      //     datetime: '2021/03/16',
      //     name: 'Miss Chad Bins',
      //     email: 'Kenna.McGlynn1@gmail.com',
      //     bref: 'Sed enim et in nihil nihil a nihil.',
      //   },
      //   {
      //     id: '7',
      //     title: 'cum-tempora-a',
      //     datetime: '2021/03/05',
      //     name: 'Luis Reichel',
      //     email: 'Kyra98@yahoo.com',
      //     bref: 'Qui omnis aliquam qui adipisci.',
      //   },
      //   {
      //     id: '8',
      //     title: 'aut-molestias-voluptatem',
      //     datetime: '2021/03/29',
      //     name: 'Winston Parisian',
      //     email: 'Tyson_Bashirian@hotmail.com',
      //     bref: 'Quo illo in iure asperiores impedit eligendi architecto eaque.',
      //   },
      //   {
      //     id: '9',
      //     title: 'assumenda-facilis-esse',
      //     datetime: '2021/03/12',
      //     name: 'Fannie Ryan',
      //     email: 'Gerald.Towne43@yahoo.com',
      //     bref: 'Atque omnis nihil quo earum vero enim possimus.',
      //   },
      //   {
      //     id: '10',
      //     title: 'perferendis-aspernatur-ullam',
      //     datetime: '2021/03/03',
      //     name: 'Yolanda Ziemann',
      //     email: 'Chauncey_Kirlin88@yahoo.com',
      //     bref: 'Quis dolorem asperiores atque laborum quos.',
      //   },
      //   {
      //     id: '16',
      //     title: 'quisquam-quibusdam-sit',
      //     datetime: '2021/03/13',
      //     name: 'Stacey Boyle',
      //     email: 'Jaylon80@yahoo.com',
      //     bref: 'Rerum dolor ad cupiditate et fuga.',
      //   },
      //   {
      //     id: '17',
      //     title: 'sit-expedita-ipsum',
      //     datetime: '2021/03/03',
      //     name: 'Lonnie Parisian',
      //     email: 'Rafael68@yahoo.com',
      //     bref: 'Vel corporis dolores eum laborum.',
      //   },
      //   {
      //     id: '18',
      //     title: 'est-omnis-vel',
      //     datetime: '2021/03/03',
      //     name: 'Faye Wolf',
      //     email: 'Emerson45@yahoo.com',
      //     bref: 'Ipsa quia dolores ea dolorum ullam non possimus magnam.',
      //   },
      //   {
      //     id: '19',
      //     title: 'inventore-dolorem-dolores',
      //     datetime: '2021/03/28',
      //     name: 'Eduardo Walker',
      //     email: 'Jamison81@gmail.com',
      //     bref: 'Ea enim ut totam modi facere sed.',
      //   },
      //   {
      //     id: '20',
      //     title: 'sint-debitis-sapiente',
      //     datetime: '2021/03/16',
      //     name: 'Nathaniel Dietrich',
      //     email: 'Fae15@hotmail.com',
      //     bref: 'Porro itaque illum nisi dolores nulla beatae sequi nesciunt quae.',
      //   },
      // ],
    };

    // 新增彈窗表單選項
    let addModalOptions = {
      id: 'addModal',
      title: '新增',
      mode: 'add',
      okTitle: '儲存',
      cancelTitle: '取消',
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

    // 回傳
    return {
      timelineOptions,
      addModalOptions,
      editModalOptions,
      deleteModalOptions,
    };
  },
  //#endregion
  mounted: function () {
    this.axios.get('/api/events').then((res) => {
      this.timelineOptions.data = res.data.data;
      this.$refs.ActivityTimeline.setOpt(this.timelineOptions);
    });
  },

  //#region === METHODS ===
  methods: {
    //#region --- Callback ---
    onEdit(id) {
      this.timelineOptions.data.forEach((x) => {
        if (x.id == id) {
          this.editModalOptions.editTarget = x;
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
      this.$refs.ActivityTimeline.addData(data);
    },
    editNewData(data) {
      // 時間軸套件方法
      this.$refs.ActivityTimeline.updateData(data);
    },
    deleteDataByID(id) {
      this.$refs.ActivityTimeline.deleteData(id);
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
