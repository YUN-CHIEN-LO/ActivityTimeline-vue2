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
        id: 'deleteModal',
        title: 'Delete',
        mode: 'delete',
        okTitle: 'Delete',
        cancelTitle: 'Cancel',
        okVariant: 'danger'
      },
    },
  },
  methods:{
      handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
     
      this.$emit('ReturnDeleteId', this.options.targetId);
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide(this.options.id);
      });
    },
  }
};
</script>

<style></style>
