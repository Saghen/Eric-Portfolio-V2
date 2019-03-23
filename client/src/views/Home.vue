<template>
  <div>
    <div id="hero">
      <div id="hero-content">
        <div id="hero-bg"></div>
        <h1>Eric Dyer</h1>
        <span>Bio-Medical and Electrical Engineer</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
body {
  margin: 0;
  padding: 0;
}

#hero {
  background: linear-gradient(-135deg, #0ff, #00f);
  background-color: #222222;
  color: #fff;
  overflow: hidden;
}

#hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 2em;
  text-shadow: 1px 1px 5px #000;

  h1 {
    font-size: 3em;
    margin: 0;
    margin-bottom: 10px;
  }
}

#hero-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  padding: 80px;
  //background: rgba(0,0,0,0.3);
  border-radius: 20px;
  filter: blur(80px);
}

@import '@/styles/fonts.scss';
</style>

<script>
import drone from '@/assets/droneBg.js';

export default {
  name: 'home',
  mounted() {
    document.querySelector('#hero').appendChild(drone.renderer.domElement);
    drone.animate();
  }
};
</script>
