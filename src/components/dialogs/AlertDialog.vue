<template>
  <b-modal
    :id="options.id"
    :title="options.title"
    :cancel-title="options.cancelTitle"
    :ok-title="options.okTitle"
    :ok-variant="options.okVariant"
    @ok="handleOk"
  >
    {{options.body}}
  </b-modal>
</template>

<script>
export default {
  name: 'AlertDialog',
  props: {
    options: {
      type: Object,
      default: {
        // DOM Id
        id: 'deleteModal',
        // 模式
        mode: 'delete',
        // Modal設定
        title: 'Delete',
        okTitle: 'Delete',
        cancelTitle: 'Cancel',
        okVariant: 'danger',
        body: '',
        targetId: '',
      },
    },
  },
  methods:{
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
     // emmit 要刪除的Id 到母組件
      this.$emit('ReturnDeleteId', this.options.targetId);
      // 關閉彈窗
      this.$nextTick(() => {
        this.$bvModal.hide(this.options.id);
      });
    },
  }
};
</script>

<style></style>
