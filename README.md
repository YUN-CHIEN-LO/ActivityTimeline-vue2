# 主要

```text
components/
└── ActivityTimeline.vue
```

# 依賴

- **bootstrap-vue**

# 使用說明

## 安裝

## 用法

### Syntax

```html
<template>
  <ActivityTimeline
    ref="ActivityTimeline"
    :options="timelineOptions"
    @onEdit="onEdit"
    @onDelete="onDelete"
  ></ActivityTimeline>
</template>

<script>
  import ActivityTimeline from '@/components/ActivityTimeline.vue';
  export default {
    components: {
      // 時間軸
      ActivityTimeline: ActivityTimeline,
    },
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
      return {
        timelineOptions,
      };
    },
    methods: {
      onEdit(id) {
        // ...
      },
      onDelete(id) {
        // ...
      },
    },
  };
</script>
```

# Options

### perItem

- Type: `Number`
- Default: `4`
- note: 一次顯示多少筆資料

### lables

- Type: `Object`
- Default: `[]`
- note: 資料格式:

### data

- Type: `Array`
- Default: `{
          loadMoreText: 'Load More',
          edit: 'Edit',
          delete: 'X',
        }`
- note: 套件文字

```
{
    id: '',
    title: '',
    datetime: '',
    name: '',
    email: '',
    bref: '',,
}
```

### onEdit

- Type: `Function`
- Default: `null`
- note: 編輯

### onDelete

- Type: `Function`
- Default: `null`
- note: 刪除

# Methods

### setOpt(options)

重設選項

- **options**
- Type: `object`

### addData(data)

新增data

- **data**
- Type: `Object`

### updateData(data)

編輯data

- **data**
- Type: `Object`

### deleteData(id)

刪除data

- **data**
- Type: `String`

### sort(type)

排序(升幂 asc|降冪 desc)

- **type**
- Type: `String`
- note: asc: 小至大， desc: 大至小
