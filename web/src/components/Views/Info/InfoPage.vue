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

<div class="container"> <!-- Lines 11-17 build header -->
	<div class="row justify-content-center">
		<div class="col-md-6 text-center mb-5">
            <img src="@/assets/umkc.png" alt="centered image" height="150" width="275"> 
			<h2 class="heading-section">GTA Qualification Information</h2>
		</div>
	</div>

	<div class="row justify-content-center"> <!-- Lines 19-59 build body content -->
		<div class="col-lg-10">
			<div class="wrapper">
				<div class="contact-wrap w-100 p-md-5 p-4 py-5">
				
				<h3 class="mb-4">Potential GTA's are evaluated based on:</h3>
				<ul>
				<li>Competence in major field</li>
				<li>Quality of training in field related to major subject</li>
				<li>Breadth of intellectual interest outside of field of specialization</li>
				<li>Originality in handling ideas</li>
				<li>Ability to work independently</li>
				<li>Ability to work with others</li>
				<li>Emotional stability</li>
				<li>Effectiveness in teaching or tutoring</li>
				<li>All factors from above are compiled into a final score out of 10. This score is an overall rating used to rate the applicants potential. </li>
				</ul>

				<h3 class="mb-4"> Further Information:</h3>
				<ul>
				<li>You must be GTA certified to work as a lab instructor. More information on the certification process can be found, here: <a href="https://catalog.umkc.edu/general-graduate-academic-regulations-information/international-graduate-student-academic-regulations/">https://catalog.umkc.edu/general-graduate-academic-regulations-information/international-graduate-student-academic-regulations/</a>. </li>
				<li>If you have questions, please contact the School of Graduate Studies at <a href="mailto:umkcsgs@umkc.edu"> umkcsgs@umkc.edu</a> or 816-235-1301.</li>
				<li>If you are not GTA certified, you may only apply for Grader positions. </li>
				<li>GTA certification for international students can only be waived with a previous degree from a US institute. </li> 
				<li>International F-1 students are limited to 20 hours/week and domestic students/PR card holders are limited to 28 hours/week. </li>
				<li>We ARE NOT hiring for any instructor positions at this time. </li>
				<li>These are the courses that, potentially, need graders:  CS 101; CS 191; CS 201R; CS 291; CS 303;CS 320; CS 349;CS 394R; CS 404; CS 441, CS 449; CS 456; CS 457; CS 458; CS 461; CS 465R; CS 470; CS 5520; CS 5525; CS 5552A; CS 5565; CS 5573; CS 5590PA; CS 5592; CS 5596A; CS 5596B; ECE 216; ECE 226; ECE 228; ECE 241; ECE 276; ECE 302; ECE 330; ECE 341R; ECE 428R; ECE 458; ECE 466; ECE 477; ECE 486; ECE 5558; ECE 5560; ECE 5567; ECE 5577; ECE 5578; ECE 5586; IT 222; IT 321 </li>
				<li>Undergraduates:  You may only apply to be a grader for a course you have taken at UMKC. </li>
				<li>Master’s Students:  You may only apply to be a grader for undergraduate courses you took during your, previous, course of study.</li>
				<li>You may only apply to grade for graduate-level classes you have taken at UMKC(and received a satisfactory grade of an A, A-or B+). </li>
				<li>PhD Students:  You may be considered as a grader for any class, based on feedback from your advisor.</li>
				<li>These are the courses that, potentially, needlab instructors:  CS 101L; CS 201L, ECE 227; ECE 229; ECE 277; ECE 303; ECE 377; ECE 331; ECE 427; ECE 429 </li>
				<li>Please do not include any courses not mentioned, above in your application as this will not help your potential employment. </li> 
				<li>Descriptions for the above-mentioned courses can be found, here:  https://catalog.umkc.edu/course-offerings/  DO NOT include a copy of a CV/resume, cover letter or reference letters as that will not help your potential employment.</li> 
				</ul>
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
import Header from '../Home/Header.vue'
import Footer from '../Home/Footer.vue'
export default {
  components: { Header, Footer },
  name: "InfoPage"
}

</script>

