<template>
  <StudentPage v-if="!this.user.isAdmin"></StudentPage>
  <AdminPage v-if="this.user.isAdmin"></AdminPage>
</template>

<script>
import StudentPage from "@/components/Views/Student/StudentPage.vue";
import AdminPage from "@/components/Views/Admin/Admin.vue";
export default {
  name: "LandingPage",
  components: {AdminPage, StudentPage},
  data(){
    return{
      user: {}
    }
  },
  async created() {
    if (!this.$store.getters.isLoggedIn) {
      await this.$router.push('/login');
    }
  },
  mounted() {
    this.user = this.$store.getters.getUser;
  }
}
</script>

<style scoped>

</style>