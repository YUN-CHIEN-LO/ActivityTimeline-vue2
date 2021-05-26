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
          <button class="btn btn-dark" @click="onEdit(card.id)">Edit</button>
          <button class="btn btn-danger" @click="onDelete(card.id)">X</button>
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
        perItem: 4,
        lables: {
          loadMoreText: '載入更多',
          edit: '編輯',
          delete: 'X',
        },
        data: [],
      },
    },
  },
  //#endregion
  //#region === DATA ===
  data() {
    let itemLen = 0;
    let cards = [];
    let maxIdstr = '0';
    let sortType='desc';
    return {
      itemLen,
      cards,
      maxIdstr,
      sortType
    };
  },
  //#endregion
  //#region === HOOKS ===
  mounted() {
    this.itemLen = this.options.perItem;
    this.sort(this.sortType);
    this.render();
  },
  //#endregion
  //#region === METHODS ===
  methods: {
    //#region Callback函式
    
    setOpt(options) {
      
      const assign =
        Object.assign ||
        function assign(target, ...args) {
          if ( args.length > 0) {
            args.forEach((arg) => {
                Object.keys(arg).forEach((key) => {
                  target[key] = arg[key];
                });
              
            });
          }

          return target;
        };

        this.options = this.options = assign({}, this.options, true && options);
        this.sort(this.sortType);
        this.render();
    },
    onEdit: function (id) {
      this.$emit('onEdit', id);
    },
    onDelete: function (id) {
      this.$emit('onDelete', id);
    },
    //#endregion

    //#region 方法函式

    /**
     * 新增卡片
     * @param {Object} [card] - (card物件)
     */
    addData: function (card) {
      // 計算最大Id
      if (this.maxIdstr == '0') {
        this.options.data.forEach((x) => {
          if (parseInt(x.id) > parseInt(this.maxIdstr)) this.maxIdstr = x.id;
        });
      }
      let maxId = parseInt(this.maxIdstr) + 1;
      this.maxIdstr = maxId.toString();

      // 設定新Id
      card.id = this.maxIdstr;

      // 新增card資訊進入data
      this.options.data.unshift(card);

      // 重新渲染
      this.render();
    },

    updateData: function (card) {
      let index = 0;
      this.options.data.forEach((x, i) => {
        if (x.id == card.id) {
          index = i;
        }
      });

      this.options.data.splice(index, 1, card);

      // 重新渲染
      this.render();
    },

    deleteData: function (id) {
      let index = 0;
      this.options.data.forEach((x, i) => {
        if (x.id == id) {
          index = i;
        }
      });

      this.options.data.splice(index, 1);

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
      let _data = this.options.data;
      this.sortType = type;
      switch (type) {
        case 'asc':
          _data.sort(function (a, b) {
            return a.id - b.id;
          });
          break;
        case 'desc':
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
      this.cards = this.options.data.slice(0, this.itemLen);
    },
    /**
     * 載入更多卡片
     */
    loadMoreCards: function () {
      // 計算載入數量
      this.itemLen += this.options.perItem;
      if (this.itemLen > this.options.data.length) this.itemLen = this.options.data.length;

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
