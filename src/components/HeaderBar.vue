<template>
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-item navbar-title">
        <p class="has-text-weight-bold">在庫管理App</p>
      </div>

      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="header-menu"
        @click="isOpen = !isOpen"
        v-bind:class="{ 'is-active': isOpen }"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div
      id="header-menu"
      class="navbar-menu js-navbar"
      v-bind:class="{ 'is-active': isOpen }"
    >
      <div class="navbar-start">
        <a class="navbar-item" href="/managestock">
          <span class="icon has-text-primary"><i class="fa fa-edit"></i></span>
          出入庫管理
        </a>
        <a class="navbar-item" href="/checkstock">
          <span class="icon has-text-primary is-medium"
            ><i class="fa fa-cubes"></i
          ></span>
          在庫一覧
        </a>
        <a class="navbar-item" href="/setting">
          <span class="icon has-text-primary"><i class="fa fa-cog"></i></span>
          商品追加
        </a>
      </div>
      <div class="navbar-end">
        <!-- <a class="navbar-item navbar-text" href="/signin">Sign In</a>
      <a class="navbar-item navbar-text" @click="signOut">Sign out</a> -->
      </div>
    </div>
  </nav>
</template>

<style lang="scss">
@import "~bulma";
$fa-font-path: "~font-awesome/fonts/";
@import "~font-awesome/scss/font-awesome";
</style>

<script>
import Firebase from "@/firebase";
import store from "@/store";

export default {
  name: "HeaderBar",
  data: function () {
    return {
      isOpen: false,
    };
  },
  created: function () {
    Firebase.onAuth();
  },
  methods: {
    // googleでサインインするときに呼ばれるfunction
    signOut: function () {
      if (store.state.status == true) {
        Firebase.logout();
        console.log("sing out");
        this.$router.push("/signin");
      } else {
        console.log("not sign in");
      }
    },
  },
};
</script>
