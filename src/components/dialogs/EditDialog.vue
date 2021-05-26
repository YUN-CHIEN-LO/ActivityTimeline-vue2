<template>
  <b-modal
    :id="options.id"
    ref="modal"
    v-bind="$attrs"
    :title="options.title"
    :cancel-title="options.cancelTitle"
    :ok-title="options.okTitle"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
  >
    <form ref="form" @submit.prevent="handleSubmit">
      <!-- date -->
      <p>{{ nowDate }}</p>
      <!-- title -->
      <b-form-group
        :label="options.labels.title"
        label-for="title-input"
        :invalid-feedback="options.invalidFeedback.title"
        :state="newData.state.title"
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
        <b-form-textarea id="email-input" v-model="newData.bref" ref="bref"></b-form-textarea>
      </b-form-group>
    </form>
  </b-modal>
</template>

<script>
export default {
  name: 'EditDialog',
  props: {
    maxId: {
      type: Number,
      default: 0,
    },
    options: {
      type: Object,
      default: {
        id: 'editModal',
        title: 'Add Card',
        mode: 'add',
      },
    },
  },
  emmits: {
    ReturnNewData: (Data) => {
      return Data;
    },
  },
  mounted() {
    // 設定今日時間
    const now = this.$dateFormatSlash(new Date());
    this.nowDate = now;
  },
  data() {
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
      nowDate: '',
    };
  },
  computed: {
    countMaxId: function () {
      return parseInt(this.maxId) + 1;
    },
  },
  methods: {
    checkFormValidity(item) {
      const valid = this.$refs[item].checkValidity();
      return valid;
    },
    resetModal() {
      switch (this.options.mode) {
        case 'add':
          for (const [key, value] of Object.entries(this.newData)) {
            if (key != 'state') {
              this.newData[key] = '';
            } else {
              for (const [x, value] of Object.entries(this.newData.state)) {
                this.newData.state[x] = null;
              }
            }
          }
          break;
        case 'edit':
          for (const [key, value] of Object.entries(this.newData)) {
            if (key != 'state') {
              this.newData[key] = this.options.editTarget[key];
            } else {
              for (const [x, value] of Object.entries(this.newData.state)) {
                this.newData.state[x] = null;
              }
            }
          }
          break;
        default:
          break;
      }
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      // 驗證表單
      this.newData.state.title = this.checkFormValidity('title');
      this.newData.state.name = this.checkFormValidity('name');
      this.newData.state.email = this.checkFormValidity('email');
      if (!this.newData.state.title || !this.newData.state.name || !this.newData.state.email) {
        return;
      }

      // 建立新Data物件
      let data = {
        id: this.newData.id,
        title: this.newData.title,
        datetime: this.nowDate,
        name: this.newData.name,
        email: this.newData.email,
        bref: this.newData.bref,
      };
      // 新增data
      this.$emit('ReturnNewData', data);
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide(this.options.id);
      });
    },
  },
};
</script>

<style lang="scss">
.close {
  background-color: transparent;
  border-radius: 5px;
  border: none;
  font-size: 24px;
  &:hover {
    font-weight: bold;
  }
}
</style>
