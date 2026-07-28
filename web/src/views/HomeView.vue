<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import umkcLogo from '@/assets/umkc.png';
import droppin from '@/assets/droppin.png';
import phone from '@/assets/phone.png';
import email from '@/assets/email.png';
import world from '@/assets/world.png';
</script>

<template>
  <AppLayout>
    <section class="app-section">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 text-center mb-5">
            <img :src="umkcLogo" alt="UMKC" height="150" width="275" />
            <h1 class="app-heading">GTA Application Portal</h1>
          </div>
        </div>

        <div class="row justify-content-center g-4">
          <div class="col-md-5">
            <div class="app-card h-100 p-4">
              <h2 class="h4 mb-3">Register to join the UMKC GTA family</h2>
              <!-- type="button" — these were bare <button>s inside a <form>,
                   so clicking them submitted the form and reloaded the page. -->
              <RouterLink to="/register" class="btn btn-primary">
                Register
              </RouterLink>

              <h2 class="h4 mb-3 mt-5">Existing GTA login</h2>
              <RouterLink to="/login" class="btn btn-outline-light">
                Login
              </RouterLink>
            </div>
          </div>

          <div class="col-md-5">
            <div class="app-card h-100 p-4">
              <h2 class="h4">Welcome to the portal</h2>
              <p class="mb-4">
                Contact UMKC if you have any problems applying or logging in.
              </p>

              <!-- alt="" on the decorative icons; the text beside each one
                   already carries the meaning. -->
              <div class="d-flex align-items-center mb-3">
                <img
                  :src="droppin"
                  alt=""
                  width="32"
                  height="32"
                  class="me-3"
                />
                <p class="mb-0">
                  <span>Address:</span> 5110 Rockhill Rd, Kansas City, MO 64110
                </p>
              </div>
              <div class="d-flex align-items-center mb-3">
                <img :src="phone" alt="" width="32" height="32" class="me-3" />
                <p class="mb-0">
                  <span>Phone:</span>
                  <a class="app-link" href="tel:+18162351000">(816) 235-1000</a>
                </p>
              </div>
              <div class="d-flex align-items-center mb-3">
                <img :src="email" alt="" width="32" height="32" class="me-3" />
                <p class="mb-0">
                  <span>Email:</span>
                  <a class="app-link" href="mailto:umkcsceworkstudy@umkc.edu">
                    umkcsceworkstudy@umkc.edu
                  </a>
                </p>
              </div>
              <div class="d-flex align-items-center">
                <img :src="world" alt="" width="32" height="32" class="me-3" />
                <p class="mb-0">
                  <span>Website:</span>
                  <a class="app-link" href="https://sce.umkc.edu/">
                    sce.umkc.edu
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
</template>
