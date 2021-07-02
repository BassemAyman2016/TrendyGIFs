/* eslint-disable prettier/prettier */
<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand @click="rerouteButtonClicked('/')" style="cursor: pointer"
        >Trendy GIFs</b-navbar-brand
      >

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- <b-navbar-nav>
          <b-nav-item href="#">Link</b-nav-item>
          <b-nav-item href="#" disabled>Disabled</b-nav-item>
        </b-navbar-nav> -->

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-button
            :pressed="false"
            @click="rerouteButtonClicked('/search')"
            size="sm"
            class="button-style"
            type="submit"
          >
            Search GIF
          </b-button>
          <b-button
            :pressed="false"
            @click="rerouteButtonClicked('/favourites')"
            size="sm"
            class="button-style"
            type="submit"
            >View Favourites</b-button
          >

          <!-- <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown> -->

          <!--<b-nav-item-dropdown right>
             Using 'button-content' slot
            <template #button-content>
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown> -->
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  methods: {
    rerouteButtonClicked(routeValue) {
      this.$router.push(routeValue);
    },
  },
};
</script>

<style>
.button-style {
  margin: 5px 5px 0px;
}
</style>
