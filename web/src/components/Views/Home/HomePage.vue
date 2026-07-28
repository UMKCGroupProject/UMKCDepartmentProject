<template>
<html lang="en">
<head>
<meta charset="utf-8">
</head>
<body>
    <Header />

<section class="ftco-section">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6 text-center mb-5">
                <img src="@/assets/umkc.png" alt="centered image" height="150" width="275"> 
                <h2 class="heading-section">GTA Application Portal</h2>
            </div>
        </div>

    <div class="row justify-content-center">
        <div class="col-lg-10">
            <div class="wrapper">
                <div class="row no-gutters">
                    <div class="col-md-6 d-flex align-items-stretch">
                        <div class="contact-wrap w-100 p-md-5 p-4 py-5">
                            <h3 class="mb-4">Register to join the UMKC GTA family!</h3>
                                <div id="form-message-warning" class="mb-4"></div> 
                                    <form>
                                        <div class="row">
                                            <button class="button-19" @click="$router.push('/Register')">Register</button>
                                            <div class="existing">
                                            <h3 class="mb-4">Existing GTA login:</h3>
                                            <button class="button-19" @click="$router.push('/login')">Login</button>
                                            </div>
                                        </div>
                                    </form>
                        </div>
                    </div>

                    <div class="col-md-6 d-flex align-items-stretch">
                        <div class="info-wrap w-100 p-md-5 p-4 py-5 img">
                              <h3>Welcome to the Portal!</h3>
                                    <p class="mb-4">You may contact UMKC if any problems occuring applying/logging in. Contact us here.</p>
                                        
                                        <div class="dbox w-100 d-flex align-items-start">
                                             <div class="icon d-flex align-items-center justify-content-center">
                                             <img src="@/assets/droppin.png" alt="centered image" height="60%" width="60%">
                                             <span class="fa fa-map-marker"></span>
                                             </div>

                                            <div class="text pl-3">
                                            <p class="mb-3"><span>Address:</span> 5110 Rockhill Rd, Kansas City, MO 64110</p>
                                            </div>
                                        </div>


                                    <div class="dbox w-100 d-flex align-items-center">
                                        <div class="icon d-flex align-items-center justify-content-center">
                                        <img src="@/assets/phone.png" alt="centered image" height="50%" width="50%">
                                        <span class="fa fa-phone"></span>
                                        </div>
                                        <div class="text pl-3">
                                        <p><span>Phone:</span> <a href="tel://1234567920">(816) 235-1000</a></p>
                                        </div>
                                    </div>

                                    <div class="dbox w-100 d-flex align-items-center">
                                        <div class="icon d-flex align-items-center justify-content-center">
                                        <img src="@/assets/email.png" alt="centered image" height="50%" width="50%">
                                        <span class="fa fa-paper-plane"></span>
                                        </div>
                                        <div class="text pl-3">
                                        <p><span>Email:</span> <a href="mailto:umkcsceworkstudy@umkc.edu"> umkcsceworkstudy@umkc.edu</a></p>
                                        </div>
                                    </div>

                                    <div class="dbox w-100 d-flex align-items-center">
                                        <div class="icon d-flex align-items-center justify-content-center">
                                        <img src="@/assets/world.png" alt="centered image" height="50%" width="50%">
                                        <span class="fa fa-globe"></span>
                                        </div>
                                        <div class="text pl-3">
                                        <p><span>Website</span> <a href="https://sce.umkc.edu/">https://sce.umkc.edu/</a></p>
                                         </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
</body>
<Footer />
</html>
</template>

<script>
import Header from './Header.vue'
import Footer from './Footer.vue'
export default {
  components: { Header, Footer },
  name: "HomePage"
}

</script>
<style scoped>
.existing{
    margin-top: 50px;
}
</style>