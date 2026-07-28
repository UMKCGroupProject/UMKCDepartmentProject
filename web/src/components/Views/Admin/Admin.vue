<template>
<AdminHeader />
<div >
  <section class="vh-25" style="background-color: skyblue;">
    <div class="center1">
      <div class="col-md-6 text-center mb-5">
        <img src="@/assets/umkc.png" alt="centered image" height="150" width="275">
      </div>
    </div>
    <div class="main">
      <div class="container py-5 h-50" >
        <div class="row d-flex justify-content-center align-items-center h-100" >
          <div class="col-12 col-md-8 col-lg-6 col-xl-5" >
            <div class="card shadow-2-strong" style="border-radius: 1rem;background-color: #272a34" >
              <div class="card-body p-5 text-center">
                <h3 class="mb-5" style="color: white">Choose Course to View Applicants</h3>
                <div class="dropdown">
                  <select class="form-select form-control" v-model="courseName" style="display: block; margin: 0 auto; width: 30%">
                    <option v-for="course in classes" :key="course.courseID" :value="course">{{ course.courseNo }} {{course.section}} </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
        <div >
          <h2 style="text-align: center">Ordered by GPA:</h2>
          <table class="table table-bordered">
            <thead>
            <tr style="background-color:lightblue;">
                    <th><button @click="loadApplicationsFName()">First Name</button></th>
                    <th><button @click="loadApplicationsLName()">Last Name</button></th>
                    <th><button>UMKC ID</button></th>
                    <th><button>Course ID</button></th>
                    <th><button @click="loadApplicationsHrs()">Credits Passed</button></th>
                    <th><button @click="loadApplicationsGPA()">GPA</button></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="application in applications" :key="application.courseID">
                    <td>{{application.fname}}</td>
                    <td>{{application.lname}}</td>
                    <td>{{application.umkcID}}</td>
                    <td>{{application.courseID}}</td> 
                    <td>{{application.hrsCompleted}}</td>
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
<div >
  <section class="vh-100" style="background-color: skyblue;">
    <!-- <div class="center1">
      <div class="col-md-6 text-center mb-5">
        <img src="@/assets/umkc.png" alt="centered image" height="150" width="275">
      </div>
    </div> -->
    <div class="main">
      <div class="container py-5 h-50" >
        <!-- <div class="row d-flex justify-content-center align-items-center h-100" >
          <div class="col-12 col-md-8 col-lg-6 col-xl-5" >
            <div class="card shadow-2-strong" style="border-radius: 1rem;background-color: #272a34" >
              <div class="card-body p-5 text-center">
                <h3 class="mb-5" style="color: white">View Candidates by Major</h3>
                <div class="dropdown">
                  <select class="form-select form-control" v-model="courseName" style="display: block; margin: 0 auto; width: 30%">
                    <option v-for="course in classes" :key="course.courseID" :value="course">{{ course.courseNo }} {{course.section}} </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div> -->
        <div>
        <div >
          <h2 style="text-align: center">Ordered by Major:</h2>
          <table class="table table-bordered">
            <thead>
            <tr style="background-color:lightblue;">
                    <th>First</th>
                    <th>Last</th>
                    <th>UMKC ID</th>
                    <th>Course ID</th>
                    <th>Current Major</th>
                    <th>GPA</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="application in majorApplications" :key="application.courseID">
                    <td>{{application.fname}}</td>
                    <td>{{application.lname}}</td>
                    <td>{{application.umkcID}}</td>
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
<Footer />
</template>

<script>
import Footer from "@/components/Views/Home/Footer.vue";
import axios from 'axios';
import AdminHeader from "@/components/Views/Admin/AdminHeader.vue";
import { API_URL as url } from '@/services/AuthService.js';

export default {
  components: {
    AdminHeader,
    Footer,
   },
  name: "Admin-page",
  data(){
    return{
      applications: {},
      majorApplications:{},
      courseName: {},
      classes: {},
    }
  },
  async created() {
    if (!this.$store.getters.isLoggedIn) {
      await this.$router.push('/login');
    }
  },
  watch: {
    courseName: function(){
      this.isShow=true;
      this.loadApplicationsGPA();
    }
  },
   mounted() {
    this.loadClasses();
  },
  methods: {
    loadClasses: function(){
      axios.get(url + "/courses").then((res) => {
        this.classes = res.data.data;
      })
          .catch(()=>{
            console.log("Something Went Wrong");
          })
    },
    loadApplicationsGPA: function() {
      try {
        axios.get(url + '/applicationsGPA', {params: {"courseNo": this.courseName.courseID }} ).then((response) => {this.applications = response.data.data});
      } catch (error) {
        this.msg = error.response.data.msg;
      }
    },
    loadApplicationsHrs: function() {
      try {
        axios.get(url + '/applicationsHrs', {params: {"courseNo": this.courseName.courseID }} ).then((response) => {this.applications = response.data.data});
      } catch (error) {
        this.msg = error.response.data.msg;
      }
    },
    loadApplicationsFName: function() {
      try {
        axios.get(url + '/applicationsFName', {params: {"courseNo": this.courseName.courseID }} ).then((response) => {this.applications = response.data.data});
      } catch (error) {
        this.msg = error.response.data.msg;
      }
    },
    loadApplicationsLName: function() {
      try {
        axios.get(url + '/applicationsLName', {params: {"courseNo": this.courseName.courseID }} ).then((response) => {this.applications = response.data.data});
      } catch (error) {
        this.msg = error.response.data.msg;
      }
    },
    loadcurrMajorApplications: function() {
      try {
        axios.get(url + '/applications/currMajor', {params: {"courseNo": this.courseName.courseID }} ).then((response) => {this.majorApplications = response.data.data});
      } catch (error) {
        this.msg = error.response.data.msg;
      }
    }
  }
};

</script>

<style scoped>
.row{
  margin-bottom: 20px;
}

button {     
    font-weight: bold;
    background-color: Transparent;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow: hidden;        
}
</style>