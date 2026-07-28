<template>
<html lang="en">
<head>
<meta charset="utf-8">
</head>
<body style="margin-bottom:5%;">
<Header />
<div class="center1">
            <div class="col-md-6 text-center mb-5">
                <img src="@/assets/umkc.png" alt="centered image" height="150" width="275"> 
            </div>
</div>
<div class="main">
<section class="vh-50">
    <div class="container py-5 h-50" >
      <div class="row d-flex justify-content-center align-items-center" >
        <div class="col-12 col-md-8 col-lg-6 col-xl-5" >
          <div class="card shadow-2-strong" style="border-radius: 1rem;background-color: #272a34" >
            <div class="card-body p-5 text-center">
              <h3 class="mb-2" style="color: white">Apply for Job:</h3>
              <div class="dropdown">
                <a href="/AppPage" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">Start Application</a>
              </div>
               <div>
                <p class="mb-0">Do you qualify for a GTA position? <a href="/info" class="fw-bold">View Criteria</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
<div >
  <section class="vh-50" style="background-color: skyblue;">
    <div class="main">
      <div class="container py-0 h-50" >
        <div>
        <div >
          <h2 style="text-align: center">Previous Applications:</h2>
          <table class="table table-bordered">
            <thead>
            <tr style="background-color:lightblue;">
                    <th>First</th>
                    <th>Last</th>
                    <th>Hours Complete</th>
                    <th>Course ID</th>
                    <th>Current Major</th>
                    <th>GPA</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="application in applications" :key="application.email">
                    <td>{{application.fname}}</td>
                    <td>{{application.lname}}</td>
                    <td>{{application.hrsCompleted}}</td>
                    <td>{{application.courseID}}</td> 
                    <td>{{application.currMajor}}</td>
                    <td>{{application.GPA}}</td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  </section>
</div>
</body>
<Footer />
</html>
</template>

<script>
import Header from "@/components/Views/Student/StudentHeader.vue";
import Footer from './Footer.vue'
import axios from 'axios';
import { API_URL as url } from '@/services/AuthService.js';


export default {
  components: { Header, Footer },
  name: "Student-page",

  data(){
    return{
      user: {},
      email: {},
      applications: {},
      allApplications:{},
      accounts: {},
    }
  },
  watch: {
    userEmail: function(){
      this.loadApplications();
    } 
  },
  mounted() {
    this.user = this.$store.getters.getUser;
   
    this.loadApplications();
   
    console.log(this.user.email);
    // this.loadAccounts();
    
  },
  methods:{
     loadApplications: function() {
      try {
        axios.get(url + '/applications/umkcId', {params: {"email": this.user.email }} ).then((response) => {
          this.applications = response.data.data;
          for(var i = 0; i<this.applications.length; i++){
          console.log(this.applications[i]);
        }
          
          });
        

      } catch (error) {
        this.msg = error.response.data.msg;
      }
    },
  }
} 
</script>

<style scoped>
.btn{
  margin-bottom: 10px;
}
.fw-bold{
  color:burlywood;
}
  
</style>