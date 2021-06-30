<template>
  <div class="home">
    <div class="label">Favourites</div>
    <div class="landing" :style="calculateStyleLanding()">
      <div
        class="holder"
        :style="calculateStyleImageHolder()"
        v-for="(item, index) in favoriteGifs"
        :key="index"
      >
        <img
          v-if="item.url"
          :src="item.url"
          :style="calculateStyleImage(item)"
          alt="text"
          @click="imgeClicked(item)"
        />
        <div class="likeButton">
          <b-icon
            @click="iconClickHandler(item)"
            :icon="`heart${item.isFavourite ? '-fill' : ''}`"
            class="likeButton__icon-style"
            :id="`button-${index}`"
          ></b-icon>
          <b-tooltip
            v-if="windowWidth > 769"
            :target="`button-${index}`"
            :title="`${item.isFavourite ? 'Unlike' : 'Like'}`"
          ></b-tooltip>
        </div>
        <!-- {{ item.id }} -->
      </div>
      <b-modal id="my-modal">Hello From My Modal!</b-modal>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      trendingGifs: [],
      chosenItem: null,
    };
  },
  methods: {
    async fetchData() {
      let headers = new Headers();

      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      headers.append("Origin", "http://localhost:8080");
      const res = await fetch(
        "https://g.tenor.com/v1/trending?key=DAV0WUE8QI44&limit=50",
        {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          // mode: "cors", // no-cors, *cors, same-origin
          // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          // credentials: 'same-origin', // include, *same-origin, omit
          // headers: headers,
          // redirect: 'follow', // manual, *follow, error
          // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          // body: JSON.stringify(data) // body data type must match "Content-Type" header
        }
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log("data", data);
          // console.log("keys", Object.keys(data));
          const results = data.results;
          console.log("results", results);
          let outputData = [];
          results.forEach((singleResult) => {
            let outputObj = { id: singleResult.id };
            const media = singleResult.media[0].gif;
            outputObj = { ...outputObj, ...media };
            outputData.push(outputObj);
          });
          // console.log("in then", outputData);
          return outputData;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      // console.log("after fetch", res);
      let tempGifs = res;
      const currentlyFavourites = this.favoriteGifs;
      tempGifs.forEach((singleItem) => {
        currentlyFavourites.forEach((singleFavourite) => {
          if (singleFavourite.id == singleItem.id) {
            singleItem.isFavourite = true;
          }
        });
        if (!singleItem.isFavourite) {
          singleItem.isFavourite = false;
        }
      });

      this.trendingGifs = tempGifs;
    },
    calculateStyleImageHolder() {
      let styleOutputOb = {};
      const screenWidth = window.innerWidth;
      if (screenWidth < 480) {
        styleOutputOb.margin = "5px 0";
      }
      // if (screenWidth >= 480 && screenWidth <= 769) {
      // }
      // if (screenWidth > 769) {
      // }
      return styleOutputOb;
    },

    calculateStyleImage(gifObj) {
      let styleOutputOb = {
        width: "50px",
        height: "150px",
      };
      //width 1, height 0
      let newWidth, newHeight;
      const screenWidth = window.innerWidth;
      // let screenHeight = window.innerHeight;
      if (screenWidth < 480) {
        newWidth = 90 + "vw";
        let widthInPixels = screenWidth * (90 / 100);
        newHeight = (widthInPixels * gifObj.dims[1]) / gifObj.dims[0];
        styleOutputOb.padding = "0 2.5vw";
      }
      if (screenWidth >= 480 && screenWidth <= 769) {
        newHeight = "30vw";
        let heightInPixels = screenWidth * (30 / 100);
        newWidth = (heightInPixels * gifObj.dims[0]) / gifObj.dims[1];
        styleOutputOb.margin = "5px 0";
      }
      if (screenWidth > 769) {
        newWidth = (150 * gifObj.dims[0]) / gifObj.dims[1];
        newHeight = "150px";
        // styleOutputOb.padding = "0 5px";
        styleOutputOb.margin = "2.5px 5px";
      }
      // newWidth = "95vw";
      // console.log(newWidth + "vw");
      styleOutputOb.width = newWidth;
      styleOutputOb.height = newHeight;
      // styleOutputOb.height = "100%";
      return styleOutputOb;
    },
    calculateStyleLanding() {
      let styleOutputOb = {};
      const screenWidth = window.innerWidth;
      styleOutputOb["justify-content"] = "center";
      // if (screenWidth < 480) {
      //   styleOutputOb.margin = "5px 0";
      // }
      if (screenWidth >= 480 && screenWidth <= 769) {
        styleOutputOb["justify-content"] = "space-evenly";
      }
      // if (screenWidth > 769) {
      // }
      return styleOutputOb;
    },
    iconClickHandler(itemObject) {
      const favouriteRemovedArray = this.favoriteGifs.filter(
        (singleFav) => singleFav.id !== itemObject.id
      );

      this.$store.commit("setFavourites", favouriteRemovedArray);
      this.trendingGifs.forEach((singleTrendingItem) => {
        if (itemObject.id == singleTrendingItem.id) {
          singleTrendingItem.isFavourite = false;
        }
      });

      this.$bvToast.toast(
        `${
          itemObject.isFavourite
            ? "GIF Liked successfully"
            : "GIF Unliked successfully"
        }`,
        {
          title: `${itemObject.isFavourite ? "GIF Liked" : "GIF Unliked"}`,
          variant: "success",
          toaster: "b-toaster-bottom-center",
          solid: true,
          noHoverPause: true,
          "auto-hide-delay": 1000,
          autoHideDelay: 1000,
        }
      );
      this.$forceUpdate();
      // console.log("itemObject", JSON.parse(JSON.stringify(itemObject)));
    },
    imgeClicked(item) {
      console.log("in imgeClicked", item);
      this.$bvModal.show("my-modal");
    },
  },
  computed: {
    favoriteGifs() {
      return this.$store.getters.getFavourites;
    },
    windowWidth() {
      return window.innerWidth;
    },
  },
  async created() {
    for (let i = 0; i < 100; i++) {
      this.trendingGifs.push({ id: i });
    }
    // await this.fetchData();
    // this.trendingGifs = this.favoriteGifs;
  },
};
</script>

<style lang="scss" scoped>
.label {
  color: white;
  padding: 5px 25px;
  font-size: 30px;
}
.home {
  background-color: #222222;
  width: 100%;
  min-height: 95vh;
}
.no-padding {
  padding: none !important;
}
.landing {
  background-color: #222222;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  // justify-content: space-evenly;
  //   justify-content: space-around;
  //   flex-direction: row;
  //   flex-wrap: wrap;
}

.holder {
  background-color: #222222;
  position: relative;
  &:hover {
    cursor: pointer;
  }
  .likeButton {
    position: absolute;
    right: 15px;
    bottom: 5px;
    outline: none;
    &__icon-style {
      font-size: 25px;
      outline: none;
      color: red;
    }
  }
}
</style>
