<template>
  <div class="favourites-page">
    <div class="label">Favourites</div>
    <div class="landing" :style="calculateStyleLanding()">
      <div
        v-show="favouriteGifsShow"
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
            :icon="`heart-fill`"
            class="likeButton__icon-style"
            :id="`button-${item.id}`"
          ></b-icon>
        </div>
        <!-- {{ item.id }} -->
      </div>
      <div v-show="!favouriteGifsShow">
        <b-spinner
          style="width: 3rem; height: 3rem"
          label="Large Spinner"
          variant="warning"
        ></b-spinner>
      </div>

      <b-modal id="my-modal">
        <div class="modal-container">
          <img
            :src="clickedImage.url"
            :style="calculateStyleImage(clickedImage)"
            alt="text"
          />
          <div v-if="clickedImage.title" class="modal-text">
            Title: {{ clickedImage.title }}
          </div>
          <div v-if="clickedImage.username" class="modal-text">
            Uploaded By: {{ clickedImage.username }}
          </div>
        </div>
      </b-modal>
    </div>
    <div class="scroll-top-holder" @click="scrollToTop()">
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
      favouriteGifsShow: false,
      clickedImage: {},
    };
  },
  methods: {
    scrollToTop() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
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
      const favouriteRemovedArray = this.favoriteGifs.filter(
        (singleFav) => singleFav.id !== itemObject.id
      );
      this.$store.commit("setFavourites", favouriteRemovedArray);
      this.$bvToast.toast(`GIF Unliked successfully`, {
        title: `GIF Unliked`,
        variant: "success",
        toaster: "b-toaster-bottom-center",
        solid: true,
        noHoverPause: true,
        autoHideDelay: 1000,
      });
      setTimeout(() => {
        this.$forceUpdate();
      }, 500);
    },
    imgeClicked(item) {
      this.clickedImage = item;
      this.$bvModal.show("my-modal");
    },
  },
  computed: {
    favoriteGifs() {
      return this.$store.getters.getFavourites;
    },
  },
  created() {
    setTimeout(() => {
      this.favouriteGifsShow = true;
    }, 1000);
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
.favourites-page {
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
