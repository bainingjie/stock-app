<template>
  <div class="stock_info">
    <div class="box">
      <div class="container has-text-centered">
        <a class="button is-hidden-tablet" v-bind:class="{'is-danger': is_show_edit_view}"
         v-on:click="is_show_edit_view = !is_show_edit_view">
          <span class="icon">
            <i class="fa" v-bind:class="{'fa-angle-down': !is_show_edit_view, 'fa-angle-up': is_show_edit_view}"></i>
          </span>
          <span>入出庫情報編集</span>
        </a>
        <div class="field is-horizontal" v-bind:class="{'is-hidden-mobile': !is_show_edit_view}">
          <p class="control has-tooltip-primary" data-tooltip="状態">
            <span class="select">
              <select v-model="IN_or_OUT">
                <option  value="入庫">入庫</option>
                <option  value="出庫">出庫</option>
              </select>
            </span>
          </p>
          <p class="control has-tooltip-primary" data-tooltip="商品">
            <span class="select">
              <select v-model="productID">
                <option v-for="(item,id) in item_info " :key=id :value=id>{{item?.product_name}}</option>
              </select>
            </span>
          </p>
          <p class="control  has-tooltip-primary" data-tooltip="個数">
            <input class="input" type="text" placeholder="個数" v-model="quantity">
          </p>
          <!-- <p class="control  has-tooltip-primary" data-tooltip="単価">
            <input class="input" type="text" placeholder="単価" v-model="priceYen">
          </p> -->
          <p class="control has-tooltip-primary" data-tooltip="反映日">
            <input class="input" type="date" v-model="applyData">
          </p>
          <p class="control has-tooltip-primary" data-tooltip="担当者">
            <span class="select">
              <select v-model="staff">
                <option  value="白">白</option>
                <option  value="張">張</option>
              </select>
            </span>
          </p>
          <p class="control">
            <a class="button is-primary" v-on:click="addStockInfo()">
              追加
            </a>
          </p>
        </div>
      </div>
    </div>
    <div class="container has-text-centered is-size-7-mobile">
      <table class="table is-striped is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th class="is-hidden-mobile"><abbr title="Index">Idx</abbr></th>
            <th>入出</th>
            <th>商品名</th>
            <!-- <th>From</th>
            <th>To</th> -->
            <th>数量</th>
            <th>担当者</th>
            <!-- <th>単価</th> -->
            <!-- <th class="is-hidden-mobile">登録日</th> -->
            <th class="is-hidden-mobile">反映日</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(stock, index) in filteredStockInfo" :key="stock.id">
            <th class="is-hidden-mobile">{{index}}</th>
            <td>{{ stock.IN_or_OUT }}</td>
            <td>{{ item_info[stock.productID]?.product_name }}</td>
            <!-- <td>{{ stock.from }}</td>
            <td>{{ stock.to }}</td> -->
            <td>{{ stock.quantity }}</td>
            <!-- <td>{{ stock.priceYen }}</td> -->
            <!-- <td class="is-hidden-mobile">{{ stock.registDate }}</td> -->
            <td>{{ stock.staff }}</td>
            <td class="is-hidden-mobile">{{ stock.applyData }}</td>
            <td><a class="button is-primary is-rounded is-small" v-on:click="deleteStockInfo(stock.key)" 
                 v-bind:class="{'is-hidden-mobile': !is_show_edit_view}">
                 削除
                </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
 
<script>
import firebase from "firebase"

const today_date = new Date()
const today_str = today_date.getFullYear() + '-' + ('0'+(today_date.getMonth()+1)).slice(-2) + '-' + ('0'+today_date.getDate()).slice(-2)

const convert_date = function(date_str, output_year=true) {
  const date = new Date(date_str)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const ret_str = output_year ? `${year}/${month}/${day}` : `${month}/${day}`
  return ret_str
}
 
export default {
  name: "StockManager",
  data() {
    return {
      database: null,
      stock_DB: null,
      stock_info: [],
      item_info:[],
      productID:"",
      staff:"白",

      productName: "",
      quantity: "",
      priceYen: "",
      applyData: today_str,
      from: "",
      to: "",
      product_name_list: [],
      place_name_list: [],
      from_name_list: [],
      to_name_list: [],
      stocking_place_list: [],
      warehouse_place_list: [],
      seller_place_list: [],
      is_show_edit_view: false,

      /* added */
      IN_or_OUT:"入庫",

    }
  },
  created: function() {
    this.database = firebase.database()
    // this.uid = firebase.auth().currentUser.uid
    // this.stock_DB = this.database.ref("stock_info/" + this.uid)
    this.stock_DB = this.database.ref("stock_info/" )
    // データに変更があると実行されるfunction
    this.stock_DB.on("value", (snapshot) => {
      this.stock_info = snapshot.val() // 再取得してstock_infoに格納する
    })
    // this.database.ref("item_info/" + this.uid).once('value')
    this.database.ref("item_info/").once('value')
      .then((snapshot) => {
        this.item_info = snapshot.val()
      })

  },
  computed: {
    filteredStockInfo: function() {
      let count_index = 0
      let ret_filter_stock_info = {}
      let key_list = []
      for (let key in this.stock_info) {
        key_list.push(key)
      }
      key_list.reverse()
      for (let idx in key_list) {
        const key = key_list[idx]
        const stock = this.stock_info[key]
        count_index += 1
        stock.registDate = convert_date(stock.registDate)
        stock.applyData = convert_date(stock.applyData, false)
        stock.key = key
        ret_filter_stock_info[count_index] = stock
      }
      return ret_filter_stock_info
    }
  },
  methods: {
    // DBのstock_info/[uid]/以下にデータを格納していく
    addStockInfo: function() {
      this.stock_DB.push({
        IN_or_OUT: this.IN_or_OUT,
        productID: this.productID,
        quantity: this.quantity,  
        staff:this.staff,      
        registDate: today_str,
        applyData: this.applyData,
      })
    },
    // stock_infoの削除
    deleteStockInfo: function(key) {
      this.stock_DB.child(key).remove()
    }
  }
}
</script>
 
<style lang="scss">
@import '~bulma';
@import '~bulma-tooltip';
</style>