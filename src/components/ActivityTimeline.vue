<template>
  <div class="timeline">
    <div
      class="row"
      v-for="(card, index) in cards"
      :key="card.id"
      :class="{ 'flex-row-reverse timeline-even': index % 2 == 1, 'timeline-odd': index % 2 == 0 }"
    >
      <div class="card col-sm-6">
        <div class="card-header">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-text">{{ card.id }}</div>
        </div>
        <div class="card-body">
          <h5 class="card-title">{{ card.name }}</h5>
          <p class="card-text">
            {{ card.email }}
          </p>
          <hr class="card-hr" />
          <p class="card-text">
            {{ card.bref }}
          </p>
        </div>
        <div class="card-footer">
          <button class="btn btn-dark" @click="onEdit(card.id)">{{ options.lables.edit }}</button>
          <button class="btn btn-danger" @click="onDelete(card.id)">
            {{ options.lables.delete }}
          </button>
          <p class="card-text text-muted">{{ card.datetime }}</p>
        </div>
      </div>
      <div class="card col-sm-6">
        <div class="card-box"></div>
      </div>
      <div class="timeline-point">
        <div class="timeline-point-text">
          {{ card.id }}
        </div>
      </div>
    </div>
    <div class="timeline-loadBtn">
      <button
        class="btn"
        :class="{ even: cards.length % 2 == 1, odd: cards.length % 2 == 0 }"
        @click="loadMoreCards"
      >
        {{ options.lables.loadMoreText }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityTimeline',
  //#region === PROPS ===
  props: {
    options: {
      type: Object,
      default: {
        // 一次顯示多少筆資料
        perItem: 4,
        // 外觀設定
        lables: {
          loadMoreText: 'Load More',
          edit: 'Edit',
          delete: 'X',
        },
        // 傳入資料
        data: [],
      },
    },
  },
  //#endregion
  //#region === DATA ===
  data() {
    // 目前顯示資料總長度
    let itemLen = 0;
    // 目前顯示的資料
    let cards = [];
    // 目前排序的方式，初始為降冪
    let sortType = 'desc';

    return {
      itemLen,
      cards,
      sortType,
    };
  },
  //#endregion
  //#region === HOOKS ===
  mounted() {
    // 初始 目前顯示資料總長度
    this.itemLen = this._options.perItem;
    // 初始 降冪排序
    this.sort(this.sortType);
    // 初始 渲染
    this.render();
  },
  //#endregion
  //#region === COMPUTED ===
  computed: {
    _options: {
      get() {
        return this.options;
      },
      set(opt) {
        return opt;
      },
    },
  },
  //#endregion COMPUTED
  //#region === METHODS ===
  methods: {
    //#region Callback函式

    /**
     * 重設options
     * @param {Object} options
     */
    setOpt(options) {
      // assign
      const assign =
        Object.assign ||
        function assign(target, ...args) {
          if (args.length > 0) {
            args.forEach((arg) => {
              Object.keys(arg).forEach((key) => {
                target[key] = arg[key];
              });
            });
          }

          return target;
        };

      // 覆蓋options
      this._options = this._options = assign({}, this._options, true && options);
      // 重新排序
      this.sort(this.sortType);
      // 重新渲染
      this.render();
    },

    /**
     * 編輯
     * @param {String} id
     */
    onEdit: function (id) {
      // emmit到母組件
      this.$emit('onEdit', id);
    },

    /**
     * 編輯
     * @param {String} id
     */
    onDelete: function (id) {
      // emmit到母組件;
      this.$emit('onDelete', id);
    },
    //#endregion

    //#region 方法函式

    /**
     * 新增卡片
     * @param {Object} [card] - (card物件)
     */
    addData: function (card) {
      // 新增card資訊進入data
      this._options.data.unshift(card);

      // 重新渲染
      this.render();
    },

    /**
     * 編輯卡片
     * @param {Object} [card] - (card物件)
     */
    updateData: function (card) {
      // 找到指定卡片在資料中的位置
      let index = 0;
      this._options.data.forEach((x, i) => {
        if (x.id == card.id) {
          index = i;
        }
      });

      // 以新卡片替換舊卡片
      this._options.data.splice(index, 1, card);

      // 重新渲染
      this.render();
    },

    /**
     * 刪除卡片
     * @param {String} id
     */
    deleteData: function (id) {
      // 找到指定卡片在資料中的位置
      let index = 0;
      this._options.data.forEach((x, i) => {
        if (x.id == id) {
          index = i;
        }
      });

      // 移除卡片
      this._options.data.splice(index, 1);

      // 重新渲染
      this.render();
    },

    /**
     * 排序
     * @param {String} [type] - (asc|desc)
     * asc: 小至大
     * desc: 大至小
     */
    sort: function (type) {
      let _data = this._options.data;
      this.sortType = type;
      switch (type) {
        case 'asc':
          // 升幂
          _data.sort(function (a, b) {
            return a.id - b.id;
          });
          break;
        case 'desc':
          // 降冪
          _data.sort(function (a, b) {
            return b.id - a.id;
          });
          break;
        default:
          break;
      }

      // 重新渲染
      this.render();
    },
    //#endregion

    //#region 內部函式
    /**
     * 渲染時間軸
     */
    render: function () {
      this.cards = this._options.data.slice(0, this.itemLen);
    },
    /**
     * 載入更多卡片
     */
    loadMoreCards: function () {
      // 計算載入數量
      this.itemLen += this._options.perItem;
      if (this.itemLen > this._options.data.length) this.itemLen = this._options.data.length;

      // 重新渲染
      this.render();
    },
    //#endregion
  },
  //#endregion
};
</script>

<style lang="scss" scoped>
$oddColor: #22ac38;
$evenColor: #f8b500;
$bgColor: #efefef;
$lineColor: #efefef;
$textColor: #151515;
$textColorLight: #999999;
$textColorTitle: #ffffff;
$textColorPoint: #ffffff;

.timeline {
  position: relative;
  &:before {
    content: '';
    position: absolute;
    width: 5px;
    background: $lineColor;
    top: 0px;
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
  }
  &.row {
    position: relative;
  }
  &-point {
    position: absolute;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    right: 50%;
    transform: translateX(50%);
    display: flex;
    justify-content: center;
    align-items: center;
    &-text {
      color: $textColorPoint;
    }
  }
  & .card {
    border: none;
    background-color: transparent;
    &-header {
      color: $textColorTitle;
      text-align: left;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      & .card-text {
        display: none;
      }
    }
    &-body {
      background-color: $bgColor;
      text-align: left;
    }
    &-title {
      font-weight: bold;
      font-size: 16px;
    }
    &-hr {
      height: 3px;
      color: $lineColor;
    }
    &-footer {
      display: flex;
      align-items: flex-end;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      overflow: hidden;
      & button {
        margin: 0px 3px;
      }
      background-color: $bgColor;
    }
    & p,
    &-hr {
      margin: 0px 0px 5px 0px;
    }
    &-box {
      height: 200px;
      color: #fff;
    }
  }
  &-loadBtn {
    margin-top: 15px;
    width: 100%;
    display: flex;
    padding-top: 150px;
    & button {
      margin-right: auto;
      margin-left: auto;
      color: $textColorTitle;
      z-index: 20;
    }
  }
  &-odd {
    & .timeline-point {
      background-color: $oddColor;
      &:after {
        position: absolute;
        content: '';
        width: 0;
        height: 0;
        border-top: 15px solid transparent;
        border-left: 30px solid $oddColor;
        border-bottom: 15px solid transparent;
        transform: translateX(-130%);
      }
    }
    & .card {
      padding-right: 40px;
      &-header {
        background-color: $oddColor;
      }
      &-footer {
        & .card-text {
          margin-left: auto;
        }
      }
    }
  }
  &-even {
    & .timeline-point {
      background-color: $evenColor;
      &:after {
        position: absolute;
        content: '';
        width: 0;
        height: 0;
        border-top: 15px solid transparent;
        border-right: 30px solid $evenColor;
        border-bottom: 15px solid transparent;
        transform: translateX(130%);
      }
    }
    & .card {
      padding-left: 40px;
      &-header {
        background-color: $evenColor;
      }
      &-footer {
        flex-direction: row-reverse;
        & .card-text {
          margin-right: auto;
        }
      }
    }
  }

  & .odd {
    background-color: $oddColor;
  }
  & .even {
    background-color: $evenColor;
  }
}
@media (max-width: 576px) {
  .timeline {
    &:before {
      display: none;
    }
    &-point {
      display: none;
    }
    & .card {
      padding: 5px !important;
      &-header {
        & .card-text {
          display: block;
        }
      }
      &-box {
        display: none;
      }
      &-footer {
        flex-direction: row;
        & .card-text {
          margin-left: auto;
          margin-right: 0;
        }
      }
    }
  }
}
</style>
