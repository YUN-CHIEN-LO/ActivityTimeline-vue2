<template>
  <b-modal
    :id="options.id"
    ref="modal"
    v-bind="$attrs"
    :title="options.title"
    :cancel-title="options.cancelTitle"
    :ok-title="options.okTitle"
    :ok-variant="options.okVariant"
    :cancel-variant="options.cancelVariant"
    :header-class="options.headerClass"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
  >
    <form ref="form" @submit.prevent="handleSubmit">
      <!-- date -->
      <p>{{ showDate }}</p>
      <!-- title -->
      <b-form-group
        :label="options.labels.title"
        label-for="title-input"
        :invalid-feedback="options.invalidFeedback.title"
        :state="newData.state.title"
        class="mb-3"
      >
        <b-form-input
          id="title-input"
          v-model="newData.title"
          :state="newData.state.title"
          ref="title"
          required
        ></b-form-input>
      </b-form-group>
      <!-- name -->
      <b-form-group
        :label="options.labels.name"
        label-for="name-input"
        :invalid-feedback="options.invalidFeedback.name"
        :state="newData.state.name"
        class="mb-3"
      >
        <b-form-input
          id="name-input"
          v-model="newData.name"
          :state="newData.state.name"
          ref="name"
          required
        ></b-form-input>
      </b-form-group>
      <!-- email -->
      <b-form-group
        :label="options.labels.email"
        label-for="email-input"
        :invalid-feedback="options.invalidFeedback.email"
        :state="newData.state.email"
        class="mb-3"
      >
        <b-form-input
          id="email-input"
          v-model="newData.email"
          :state="newData.state.email"
          ref="email"
          pattern="^[A-Za-z0-9]+((-[A-Za-z0-9]+)|(\.[A-Za-z0-9]+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$"
          required
        ></b-form-input>
      </b-form-group>

      <!-- bref -->
      <b-form-group :label="options.labels.bref" label-for="bref-input">
        <b-form-textarea
          id="email-input"
          rows="3"
          max-rows="6"
          v-model="newData.bref"
          ref="bref"
        ></b-form-textarea>
      </b-form-group>
    </form>
  </b-modal>
</template>

<script>
export default {
  name: 'EditDialog',
  //#region === PROPS ===
  props: {
    options: {
      type: Object,
      default: {
        // DOM Id
        id: 'editModal',
        // 模式
        mode: 'add',
        // Modal設定
        title: 'Add',
        okTitle: 'Save',
        cancelTitle: 'Cancel',
        headerClass: 'odd',
        okVariant: 'dark',
        cancelVariant: 'outline-dark',
        // 自訂label
        labels: {
          title: 'Title',
          name: 'Name',
          email: 'Email',
          bref: 'Brief',
        },
        // 驗證錯誤訊息
        invalidFeedback: {
          title: 'Title cannot be empty.',
          name: 'Name cannot be empty.',
          email: 'Wrong email format.',
        },
        // 編輯對象
        editTarget: null,
      },
    },
  },
  //#endregion PROPS
  //#region === EMMITS ===
  emmits: {
    /**
     * 回傳表單收集到的物件資料
     */
    ReturnNewData: (Data) => {
      return Data;
    },
  },
  //#endregion EMMITS
  //#region === DATA ===
  data() {
    // 新data物件
    let newData = {
      id: '',
      title: '',
      datetime: '',
      name: '',
      email: '',
      bref: '',
      state: {
        title: null,
        name: null,
        email: null,
      },
    };
    return {
      newData,
      // 顯示日期
      showDate: '',
    };
  },
  //#endregion DATA
  //#region === METHODS ===
  methods: {
    /**
     * 驗證表單資訊
     */
    checkFormValidity(item) {
      const valid = this.$refs[item].checkValidity();
      return valid;
    },

    /**
     * 重製表單
     */
    resetModal() {
      switch (this.options.mode) {
        case 'add':
          // 若模式mode=add，清空表單
          for (const [key, value] of Object.entries(this.newData)) {
            if (key != 'state') {
              this.newData[key] = '';
            } else {
              for (const [x, value] of Object.entries(this.newData.state)) {
                this.newData.state[x] = null;
              }
            }
          }
          // 取得今天日期
          this.showDate = this.$dateFormatSlash(new Date());
          break;

        case 'edit':
          // 若模式mode=edit，清空表單
          for (const [key, value] of Object.entries(this.newData)) {
            if (key != 'state') {
              this.newData[key] = this.options.editTarget[key];
            } else {
              for (const [x, value] of Object.entries(this.newData.state)) {
                this.newData.state[x] = null;
              }
            }
          }
          // 取得物件日期
          this.showDate = this.$dateFormatSlash(this.options.editTarget.datetime);
          break;

        default:
          break;
      }
    },

    /**
     * 處理ok事件
     */
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      // 觸發 submit handler
      this.handleSubmit();
    },

    /**
     * 處理 submit 事件
     */
    handleSubmit() {
      // 驗證表單
      this.newData.state.title = this.checkFormValidity('title');
      this.newData.state.name = this.checkFormValidity('name');
      this.newData.state.email = this.checkFormValidity('email');
      if (!this.newData.state.title || !this.newData.state.name || !this.newData.state.email) {
        return;
      }

      let data = null;
      switch (this.options.mode) {
        case 'add':
          // 建立新Data物件
          data = {
            id: this.newData.id,
            title: this.newData.title,
            datetime: this.nowDate,
            name: this.newData.name,
            email: this.newData.email,
            bref: this.newData.bref,
          };
          break;

        case 'edit':
          // 建立新Data物件
          data = {
            id: this.newData.id,
            title: this.newData.title,
            datetime: this.options.editTarget.datetime,
            name: this.newData.name,
            email: this.newData.email,
            bref: this.newData.bref,
          };
          break;

        default:
          break;
      }

      // emmit 要新增的data 到母組件
      this.$emit('ReturnNewData', data);

      // 關閉彈窗
      this.$nextTick(() => {
        this.$bvModal.hide(this.options.id);
      });
    },
  },
  //#endregion METHODS
};
</script>

<style lang="scss">
.close {
  background-color: transparent;
  border-radius: 5px;
  border: none;
  font-size: 24px;
  color: white;
  &:hover {
    font-weight: bold;
  }
}
$oddColor: #22ac38;
$evenColor: #f8b500;
.odd {
  background-color: $oddColor;
  color: white;
}
.even {
  background-color: $evenColor;
  color: white;
}
</style>
