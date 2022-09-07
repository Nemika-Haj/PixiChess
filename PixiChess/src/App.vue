<script setup lang="ts">
</script>
<template>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

button {
  background-color: green;
  color: white;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 10px;
  border: 2px solid gray;
  margin: 0 auto;
  cursor: pointer;
}

#notConnectedContainer {
  display: flex;
  flex-direction: column;
}

#chatBox {
  display: flex;
  flex-direction: column;
  border: 2px solid black;
  height: 70px;
  padding: 10px;
  margin: 10px;
  position: relative;
  max-width: 100vw;
}

#notConnected {
  text-align: center;
  color: tomato;
}

#connectedContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#messageContainer {
  max-width: 95vw;
  height: 48px;
  overflow-x: hidden;
  overflow-y: auto;
  width: 95vw;
  font-size: 12px;
  line-height: 12px;
}

#messageInput {
  border: 2px solid black;
  border-radius: 5px;
  position: absolute;
  bottom: 10px;
  width: 99%;
  height: 20px;
  padding: 0 5px;
}
</style>
