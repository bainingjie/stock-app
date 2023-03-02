<template>
  <div class="setting">
    <div class="columns">
      <div class="column">
        <div class="card">
          <div class="card-content">
            <p class="title is-size-5-mobile">商品追加</p>
            <div class="field has-addons">
              <p class="control is-expanded">
                <label class="label">商品番号</label>
                <input
                  class="input is-size-7-mobile"
                  type="text"
                  placeholder="商品番号"
                  v-model="product_number"
                />
                <label class="label">商品名</label>
                <input
                  class="input is-size-7-mobile"
                  type="text"
                  placeholder="商品名"
                  v-model="product_name"
                />
                <label class="label">カテゴリー</label>
                <input
                  class="input is-size-7-mobile"
                  type="text"
                  placeholder="カテゴリー"
                  v-model="product_category"
                />
                <label class="label">幅</label>
                <input
                  class="input is-size-7-mobile"
                  type="text"
                  placeholder="(W)幅 (cm)"
                  v-model="product_width"
                  @keypress="isNumber($event)"
                />
                <label class="label">奥行</label>
                <input
                  class="input is-size-7-mobile"
                  type="text"
                  placeholder="(D)奥行 (cm)"
                  v-model="product_depth"
                  @keypress="isNumber($event)"
                />
                <label class="label">高さ</label>
                <input
                  class="input is-size-7-mobile"
                  type="text"
                  placeholder="(H)高さ (cm)"
                  v-model="product_height"
                  @keypress="isNumber($event)"
                />
                <label class="label">重量</label>
                <input
                  class="input is-size-7-mobile"
                  type="text"
                  placeholder="重量（g）"
                  v-model="product_weight"
                  @keypress="isNumber($event)"
                />
                <label class="label">色(optional)</label>
                <input
                  class="input is-size-7-mobile"
                  type="text"
                  placeholder="色(optional)"
                  v-model="product_color"
                />
                <label class="label">サイズ(optional)</label>
                <input
                  class="input is-size-7-mobile"
                  type="text"
                  placeholder="サイズ(optional)"
                  v-model="product_size"
                />
              </p>
            </div>
            <div class="mb-3">
              <p class="control">
                <a
                  class="button is-primary is-size-7-mobile"
                  v-on:click="addProductInfo()"
                >
                  追加
                </a>
              </p>
            </div>

            <!-- <div
              class="field has-addons mt-3"
              v-for="item in filterProductList"
              :key="item.key"
            >
              <p class="control is-expanded">
                <input
                  class="input is-size-7-mobile"
                  type="text"
                  :value="item.product_name"
                  readonly
                />
                <span
                  >商品番号:{{ item.product_number }}、カテゴリー：{{
                    item.product_category
                  }}、サイズ:{{ item.product_width }}*{{
                    item.product_depth
                  }}*{{ item.product_height }}、重量:{{
                    item.product_weight
                  }}</span
                >
              </p>
              <p class="control">
                <a
                  class="button is-danger is-size-7-mobile"
                  v-on:click="deleteItemInfo(item.key)"
                >
                  削除
                </a>
              </p>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

const PRODUCT_NAME = 1;

export default {
  name: "StockManager",
  data() {
    return {
      database: null,
      item_DB: null,
      item_list: [],

      /* product field */
      product_name: "",
      product_number: "",
      product_category: "",
      product_width: "",
      product_depth: "",
      product_height: "",
      product_weight: "",
      product_color: "",
      product_size: "",
    };
  },
  created: function () {
    this.database = firebase.database();
    // this.uid = firebase.auth().currentUser.uid;
    // this.item_DB = this.database.ref("item_info/" + this.uid);
    this.item_DB = this.database.ref("item_info/");

    // データに変更があると実行されるfunction
    this.item_DB.on("value", (snapshot) => {
      this.item_list = snapshot.val(); // 再取得してstock_infoに格納する
    });
  },
  computed: {
    filterProductList: function () {
      return this.filterItemList(PRODUCT_NAME);
    },
  },
  methods: {
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    // DBのitem_info/[uid]/以下にデータを格納していく
    addProductInfo: function () {
      let is_filled =
        this.product_name &&
        this.product_category &&
        this.product_number &&
        this.product_width &&
        this.product_height &&
        this.product_depth &&
        this.product_weight;
      if (!is_filled) {
        window.alert("入力を全部埋めてください");
        return false;
      }
      console.log(is_filled);

      this.item_DB.push({
        // type: PRODUCT_NAME,
        product_name: this.product_name,
        product_number: this.product_number,
        product_category: this.product_category,
        product_width: this.product_width,
        product_depth: this.product_depth,
        product_height: this.product_height,
        product_weight: this.product_weight,
        product_color: this.product_color,
        product_size: this.product_size,
      });
      window.alert("商品を追加しました");
      this.product_name = "";
      this.product_category = "";
      this.product_number = "";
      this.product_width = "";
      this.product_height = "";
      this.product_depth = "";
      this.product_weight = "";
      this.product_color = "";
      this.product_size = "";
    },
    // deleteItemInfo: function (key) {
    //   this.item_DB.child(key).remove();
    // },
    // filterItemList: function (type_num) {
    //   let ret_filter_item_list = {};
    //   for (let key in this.item_list) {
    //     let item = this.item_list[key];
    //     if (item.type == type_num) {
    //       item.key = key;
    //       ret_filter_item_list[key] = item;
    //     }
    //   }
    //   return ret_filter_item_list;
    // },
  },
};
</script>

<style lang="scss">
@import "~bulma";
@import "~bulma-tooltip";
.setting {
  padding: 10px;
}
.input {
  margin-top: 10px;
}
</style>
