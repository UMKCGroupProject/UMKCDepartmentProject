<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <div class="navbar-brand" href="#">Student Portal</div>
      <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
           <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/">
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/info"
            >Info</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link active" style="text-align:right;" aria-current="page" to="/login">
              Login
            </router-link>
          </li>
        </ul>
        <ul class ='navbar-nav'>
          <button style="background-color: #1c1e25" class="nav-item" id="navbarSupportedContent" @click="logout">
            <router-link class="nav-link active" style="" aria-current="page" to="/">
              Logout
            </router-link>
          </button>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Student-header",
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    }
  }
};
</script>
