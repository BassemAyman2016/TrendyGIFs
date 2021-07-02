<template>
  <div class="home">
    <div class="label">Trending</div>
    <div class="landing" :style="calculateStyleLanding()">
      <div
        v-show="trendingGifsShow"
        class="holder"
        :style="calculateStyleImageHolder()"
        v-for="(item, index) in trendingGifs"
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
      <div v-show="!trendingGifsShow">
        <b-spinner
          style="width: 3rem; height: 3rem"
          label="Large Spinner"
          variant="warning"
        ></b-spinner>
      </div>

      <template v-if="trendingGifsShow">
        <div style="flex-basis: 100%; margin: 15px">
          <div
            style="
              width: 100%;
              display: flex;
              flex-flow: row wrap;
              justify-content: center;
            "
          >
            <b-spinner
              v-observe-visibility="visibilityChanged"
              style="width: 3rem; height: 3rem"
              label="Large Spinner"
              variant="warning"
            ></b-spinner>
          </div>
        </div>
      </template>

      <b-modal id="my-modal">
        <div class="modal-container">
          <!-- <div
            class="modal-image-holder"
            :style="{
              'background-image': 'url(' + clickedImage.url + ')',
              width: clickedImage.width + 'px',
              height: clickedImage.height + 'px',
            }"
          ></div> -->
          <img
            :src="clickedImage.url"
            :style="calculateStyleImage(clickedImage)"
            alt="text"
          />
          <!-- <img :src="clickedImage.url" alt="" /> -->
          <div v-if="clickedImage.title" class="modal-text">
            Title: {{ clickedImage.title }}
          </div>
          <div v-if="clickedImage.username" class="modal-text">
            Uploaded By: {{ clickedImage.username }}
          </div>
        </div>
      </b-modal>
    </div>
    <div class="scroll-top-holder" title="Scroll to Top" @click="scrollToTop()">
      <div class="icon-container">
        <b-icon icon="arrow-up-square" class="up-arrow"></b-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      trendingGifs: [],
      offset: 0,
      isFetchingData: 0,
      trendingGifsShow: false,
      clickedImage: {},
    };
  },
  methods: {
    async fetchData() {
      this.isFetchingData = true;
      const fetchedData = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=nhK4qpgBspnj7pEqaX6tH8HgP4PC8Lkt&limit=30&offset=${this.offset}`,
        {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
        }
      )
        .then((response) => response.json())
        .then((data) => {
          return data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      this.offset += fetchedData.pagination.count;
      let data = fetchedData.data;
      let outputArray = data;

      const currentlyFavourites = this.favoriteGifs;

      outputArray.forEach((singleItem) => {
        let chosenItemData = singleItem.images.original;
        singleItem.height = parseInt(chosenItemData.height);
        singleItem.width = parseInt(chosenItemData.width);
        singleItem.url = chosenItemData.url;

        currentlyFavourites.forEach((singleFavourite) => {
          if (singleFavourite.id == singleItem.id) {
            singleItem.isFavourite = true;
          }
        });
        if (!singleItem.isFavourite) {
          singleItem.isFavourite = false;
        }
        this.trendingGifs.push(singleItem);
      });
      // this.trendingGifs = outputArray;
      setTimeout(() => {
        this.trendingGifsShow = true;
        this.isFetchingData = false;
      }, 3000);
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
        newHeight = (widthInPixels * gifObj.height) / gifObj.width + "px";
        styleOutputOb.padding = "0 2.5vw";
      }
      if (screenWidth >= 480 && screenWidth <= 769) {
        newHeight = "30vw";
        let heightInPixels = screenWidth * (30 / 100);
        newWidth = (heightInPixels * gifObj.width) / gifObj.height + "px";
        styleOutputOb.margin = "5px 0";
      }
      if (screenWidth > 769) {
        newWidth = (150 * gifObj.width) / gifObj.height + "px";
        newHeight = "150px";
        // styleOutputOb.padding = "0 5px";
        styleOutputOb.margin = "2.5px 5px";
      }
      // newWidth = "95vw";
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
      if (itemObject.isFavourite) {
        const favouriteRemovedArray = this.favoriteGifs.filter(
          (singleFav) => singleFav.id !== itemObject.id
        );

        this.$store.commit("setFavourites", favouriteRemovedArray);
        this.trendingGifs.forEach((singleTrendingItem) => {
          if (itemObject.id == singleTrendingItem.id) {
            singleTrendingItem.isFavourite = false;
          }
        });
      } else {
        itemObject.isFavourite = true;
        let currenltyFavourites = JSON.parse(JSON.stringify(this.favoriteGifs));
        currenltyFavourites.push(itemObject);

        this.$store.commit("setFavourites", currenltyFavourites);
        this.trendingGifs.forEach((singleTrendingItem) => {
          if (itemObject.id == singleTrendingItem.id) {
            singleTrendingItem.isFavourite = true;
          }
        });
      }
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
    },
    imgeClicked(item) {
      this.clickedImage = item;
      this.$bvModal.show("my-modal");
    },
    async visibilityChanged(isVisible) {
      if (isVisible) {
        if (!this.isFetchingData) {
          await this.fetchData();
        }
      }
    },
    scrollToTop() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
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
    await this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
.modal-text {
  margin-top: 5px;
}
.modal-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.modal-image-holder {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.label {
  color: white;
  padding: 5px 25px;
  font-size: 30px;
}
.home {
  background-color: #222222;
  width: 100%;
  min-height: 95vh;
  position: relative;
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
.scroll-top-holder {
  position: fixed;
  left: 2vw;
  bottom: 2vh;
  width: 50px;
  height: 50px;
  background-color: dodgerblue;
  border-radius: 50px;
  cursor: pointer;
}
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
.up-arrow {
  font-size: 50px;
  color: white;
}
</style>
