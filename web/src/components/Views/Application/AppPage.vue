<template>
<html lang="en">
<head>
<title> Apply </title>
<meta charset="utf-8">
</head>
<body style="margin-bottom:5%;">
<div>
<Header />
</div>
  <section class="ftco-section">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-md-6 text-center mb-5">
          <img src="@/assets/umkc.png" alt="centered image" height="150" width="275">
					<h2 class="heading-section">Apply</h2>
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
               <input type="text" class="form-control" placeholder="ID" v-model="umkcID" />
               </div>
               </div>
              <div class="row mt-4">
                <div>
                  <label for="" class="mt-1">Email</label>
                </div>
                <div class="col-md-6">
                  <input type="text" class="form-control" placeholder="example@umsystem.edu" v-model="email" />
                </div>
              </div>
               <div class="row mt-4">
               <div>
               <label for="" class="mt-1">UMKC Current Level (BA/BS/MS/PhD)</label>
               </div>
               <div class="col-md-6">
               <select name="CurrentLevel" class="form-select" id="CurrentLevel" v-model="currLevel">
                  <option value="BA">BA</option>
                  <option value="BS">BS</option>
                  <option value="MS">MS</option>
                  <option value="PhD">PhD</option>
                </select>
               </div>

               <div class="row mt-4">
               <div>
               <label for="" class="mt-1">Graduating Semester</label>
               </div>
               <div class="col-md-6">
               <select name="GradSemester" class="form-select" id="GradSemester" v-model="gradSemester">
                  <option value="Spring 22">Spring 22</option>
                  <option value="Summer 22">Summer 22</option>
                  <option value="Fall 22">Fall 22</option>
                  <option value="Spring 23">Spring 23</option>
                  <option value="Summer 23">Summer 23</option>
                  <option value="Fall 23">Fall 23</option>
                  <option value="Spring 24">Spring 24</option>
                  <option value="Summer 24">Summer 24</option>
                  <option value="Fall 24">Fall 24</option>
                  <option value="Spring 25">Spring 25</option>
                  <option value="Summer 25">Summer 25</option>
                  <option value="Fall 25">Fall 25</option>
                  <option value="Spring 26">Spring 26</option>
                  <option value="Summer 26">Summer 26</option>
                  <option value="Fall 26">Fall 26</option>

                </select>
               </div>

              <div>
              <label for="" class="mt-1">UMKC Cumulative GPA (leave blank if first semester is in progress) </label>
              </div>
              <div class="col-md-6">
              <input type="text" class="form-control" placeholder="UMKC Cumlative GPA" v-model="GPA" />
              </div>

              <div>
              <label for="" class="mt-1">Hours completed at UMKC (leave blank if first semester is in progress)</label>
              </div>
              <div class="col-md-6">
              <input type="text" class="form-control" placeholder="Hours done at UMKC" v-model="hrsCompleted" />
              </div>

              <div>
              <label for="" class="mt-1">Undergraduate Degree (if applicable, e.g., BTEC, BSCS, IT)</label>
              </div>
              <div class="col-md-6">
              <input type="text" class="form-control" placeholder="Undergraduate Degree" v-model="degree" />
              </div>

              <div>
              <label for="" class="mt-1">Current Major(CS/IT/ECE/EE)</label>
              </div>
              <div class="col-md-6">
              <select name="CurrentMajor" class="form-select" id="CurrentMajor" v-model="currMajor">
                  <option value="CS">CS</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EE">EE</option>
                </select>
              </div>

              <div>
              <label for="" class="mt-1">Applying for: (Grader, Lab Instructor or Both) </label>
              </div>
              <div class="col-md-6">
              <select name="applying" class="form-select" id="applying" v-model="position">
                  <option value="Grader">Grader</option>
                  <option value="Lab Instructor">Lab Instructor</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div>
              <label for="" class="mt-1"> Are you GTA Certified?</label>
              </div>
              <div class="col-md-6">
              <select name="" id="" class="form-select" v-model="certified">
              <option value=""> </option>
              <option value="1">Certified</option>
              <option value="0">Not Certified</option>
              </select>
              </div>
              <div class="row mt-4">
               <div>
               <label for="" class="mt-1">If certified, term of completion. </label>
               </div>
               <div class="col-md-6">
               <input type="text" class="form-control" placeholder="" v-model="certificationTerm" />
               </div>
               </div>
             
              <div>
              <label for="" class="mt-1">If you have a previous degree from a US Institute, please indicate this as that waives GTA certification. </label>
              </div>
              <div class="col-md-6">
              <select name="" id="" class="form-select" v-model="prevDegree">
              <option value=""> </option>
              <option value="1">Previous Degree</option>
              <option value="0">No Previous Degree</option>
              </select>
              </div>
             <div>
             <label for="" class="mt-1">Course you would like to serve as lab instructor or grader for(ex. CS 201L/CS 5525/ECE 216, etc.)</label>
             </div>
             <div class="col-md-6">
             <input type="text" class="form-control" placeholder="Courses" v-model="courseID" />

             <div class="row mt-4">
                 <button class="btn btn-primary" @click="postApp">Apply</button>
                 <p style="color:skyblue" v-if="msg"> {{ msg }}</p>
             </div>
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
import Header from "@/components/Views/Home/Header.vue";
 import Footer from "@/components/Views/Home/Footer.vue";
import AuthService from "@/services/AuthService";
export default {
  name: "AppPage",
   components: {
     Header,
     Footer
   },
  data() {
    return{
      fname: "",
      lname: "",
      umkcID: null,
      id: "",
      email: "",
      currLevel: "",
      gradSemester: "",
      GPA: null,
      degree:"",
      hrsCompleted: null,
      currMajor: "",
      position: "",
      certified: false,
      certificationTerm: "",
      prevDegree: false,
      courseID: null,
      courses: {},
      msg: ''
    }
  },
  async created() {
    if (!this.$store.getters.isLoggedIn) {
      await this.$router.push('/login');
    }
  },
  methods: {
    async postApp() {
      try {
        const credentials = {
          fname: this.fname,
          lname: this.lname,
          umkcID: this.umkcID,
          email: this.email,
          currLevel: this.currLevel,
          gradSemester: this.gradSemester,
          GPA: this.GPA,
          hrsCompleted: this.hrsCompleted,
          degree: this.degree,
          currMajor: this.currMajor,
          position: this.position,
          certified: this.certified,
          courseID: this.courseID,
        };
        const response = await AuthService.postApp(credentials);
        this.msg = response.msg;
      } catch (error) {
        this.accountMsg = error.response.data.accountMsg;
      }
    },
  }
};
</script>
