<template>
  <div class="home">
    <div class="label">Search</div>
    <div class="label">
      <b-form-input
        v-model="searchText"
        placeholder="Enter search text here"
        type="search"
      ></b-form-input>
    </div>
    <div class="landing" v-if="hideSpinner" :style="calculateStyleLanding()">
      <div
        class="holder"
        :style="calculateStyleImageHolder()"
        v-for="(item, index) in searchGifs"
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
        </div>
        <!-- {{ item.id }} -->
      </div>

      <b-modal id="my-modal">
        <div class="modal-container">
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
    <div v-show="!hideSpinner" style="flex-basis: 100%; margin: 15px">
      <div
        style="
          width: 100%;
          display: flex;
          flex-flow: row wrap;
          justify-content: center;
        "
      >
        <b-spinner
          style="width: 3rem; height: 3rem"
          label="Large Spinner"
          variant="warning"
        ></b-spinner>
      </div>
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
      searchGifs: [],
      offset: 0,
      isFetchingData: 0,
      hideSpinner: true,
      clickedImage: {},
      searchText: "",
    };
  },
  methods: {
    async searchGif() {
      this.hideSpinner = false;
      const fetchedData = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=nhK4qpgBspnj7pEqaX6tH8HgP4PC8Lkt&limit=30&q=${this.searchText}`,
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
      });
      this.searchGifs = [];
      this.searchGifs = outputArray;
      this.$forceUpdate();
      setTimeout(() => {
        this.hideSpinner = true;
        this.isFetchingData = false;
      }, 3000);
    },
    calculateStyleImageHolder() {
      let styleOutputOb = {};
      const screenWidth = window.innerWidth;
      if (screenWidth < 480) {
        styleOutputOb.margin = "5px 0";
      }
      return styleOutputOb;
    },

    calculateStyleImage(gifObj) {
      let styleOutputOb = {
        width: "50px",
        height: "150px",
      };
      let newWidth, newHeight;
      const screenWidth = window.innerWidth;
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
        styleOutputOb.margin = "2.5px 5px";
      }

      styleOutputOb.width = newWidth;
      styleOutputOb.height = newHeight;
      return styleOutputOb;
    },
    calculateStyleLanding() {
      let styleOutputOb = {};
      const screenWidth = window.innerWidth;
      styleOutputOb["justify-content"] = "center";

      if (screenWidth >= 480 && screenWidth <= 769) {
        styleOutputOb["justify-content"] = "space-evenly";
      }

      return styleOutputOb;
    },
    iconClickHandler(itemObject) {
      if (itemObject.isFavourite) {
        const favouriteRemovedArray = this.favoriteGifs.filter(
          (singleFav) => singleFav.id !== itemObject.id
        );

        this.$store.commit("setFavourites", favouriteRemovedArray);
        this.searchGifs.forEach((singleTrendingItem) => {
          if (itemObject.id == singleTrendingItem.id) {
            singleTrendingItem.isFavourite = false;
          }
        });
      } else {
        itemObject.isFavourite = true;
        let currenltyFavourites = JSON.parse(JSON.stringify(this.favoriteGifs));
        currenltyFavourites.push(itemObject);

        this.$store.commit("setFavourites", currenltyFavourites);
        this.searchGifs.forEach((singleTrendingItem) => {
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
  watch: {
    async searchText(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue === "") {
          this.searchGifs = [];
          this.$forceUpdate();
        } else {
          await this.searchGif();
        }
      } else {
        this.searchGifs = [];
        this.$forceUpdate();
      }
    },
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
