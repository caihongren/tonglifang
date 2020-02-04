<template>
    <div>
        shouye{{name}}
        <headers/>
    </div>
</template>

<script lang="ts">
import headers from '../components/home/header.vue'
import Vue from 'vue'
export default Vue.extend({
    data(){
        return{
            name:'首页'
        }
    },
    components: {
    headers,
  },
})
</script>

<style lang="lass" scoped>

</style>