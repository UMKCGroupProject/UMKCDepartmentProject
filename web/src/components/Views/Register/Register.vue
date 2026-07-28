<template>
<html lang="en">
<head>
<title> GTA Qualification Information</title>
<meta charset="utf-8">
</head>
<body style="margin-bottom:5%;">
<div>
<Header />
</div>
	<section class="ftco-section"> 
		<div class="container"> <!-- Lines 9-15 build header -->
			<div class="row justify-content-center">
				<div class="col-md-6 text-center mb-5">
          <img src="@/assets/umkc.png" alt="centered image" height="150" width="275"> 
					<h2 class="heading-section">Register</h2>
        </div>
      </div>

			<div class="row justify-content-center">
				<div class="col-lg-10">
					<div class="wrapper">
						<div class="contact-wrap w-100 p-md-5 p-4 py-5">
              <div class="col-md-10">
                <div class="row mt-4">
                  
                  <div>
                  <label for="" class="mt-1">Name</label>
                  </div>
                  <div class="col-md-4">
                  <input type="text" class="form-control" v-model="fname" placeholder="First Name" />
                  </div>
                  <div class="col-md-4">
                  <input type="text" class="form-control" v-model="lname" placeholder="Last Name" />
                  </div>
                  </div>
                  
                  <div class="row mt-4">
                  <div>
                  <label for="" class="mt-1">UMKC ID</label>
                  </div>
                  <div class="col-md-6">
                  <input type="text" class="form-control" placeholder="12345678" v-model="umkcID" />
                  </div>
                  </div>
       
                 <div class="row mt-4">
                 <div>
                 <label for="" class="mt-1">Email</label>
                 </div>
                 <div class="col-md-6">
                 <input type="text" class="form-control" placeholder="example@test.com" v-model="email" />
                 </div>
          
                 <div class="row mt-4">
                 <div>
                 <label for="" class="mt-1">Contact Number</label>
                 </div>
                 <div class="col-md-6">
                 <input type="text" class="form-control" placeholder="8165555555" v-model="contactNo" />
                 </div>
                 </div>
                 </div>

                 <div class="row mt-4">
                 <div>
                 <label for="" class="mt-1">GTA Certified</label>
                 </div>
                 <div class="col-md-6">
                 <select name="" id="" class="form-select" v-model="certified">
                 <option value=""> </option>
                 <option value="1">Yes</option>
                 <option value="0">No</option>
                 </select>
                 </div>
                 </div>
                 <div class="row mt-4">
                 <div class="col-md-4">
                   <button class="btn btn-primary" @click="signUp">Register</button>
                   <p style="color:skyblue" v-if="response"> {{ response.msg }}</p>
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
// import axios from 'axios';
import AuthService from '@/services/AuthService.js';
import Header from "@/components/Views/Home/Header.vue";
import Footer from "@/components/Views/Home/Footer.vue";
export default {
  name: "RegisterPage",
  components: {
    Header,
    Footer
  },
  data() {
    return{
      fname: "",
      lname: "",
      umkcID: "",
      id: "",
      email: "",
      certified: false,
      contactNo: "",
      accountMsg: "",
      studentMsg: "",
      isAdmin: 0,
      response: {},
      response2: {}
    }
  },
  methods: {
    async signUp() {
      if(this.umkcID.length === 9){
        this.isAdmin = 1;
      }
      try {
        const credentials = {
          fname: this.fname,
          lname: this.lname,
          umkcID: this.umkcID,
          email: this.email,
          contactNo: this.contactNo,
          certified: this.certified,
          isAdmin: this.isAdmin
        };
        this.response = await AuthService.signUp(credentials);
        this.response2 = await AuthService.postStudent(credentials);
        this.accountMsg = this.response.msg;
        console.log(this.response.message);
        this.studentMsg = this.response2.msg
        if(this.accountMsg === "Registered!"){
           await this.$router.push('/login');
        }
      } catch (error) {
        this.accountMsg = error.response.data.accountMsg;
      }
    },
  }
};
</script>