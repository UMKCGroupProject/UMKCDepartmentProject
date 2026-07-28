<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import umkcLogo from '@/assets/umkc.png';

const criteria = [
  'Competence in major field',
  'Quality of training in field related to major subject',
  'Breadth of intellectual interest outside the field of specialization',
  'Originality in handling ideas',
  'Ability to work independently',
  'Ability to work with others',
  'Effectiveness in teaching or tutoring',
];
</script>

<template>
  <AppLayout>
    <section class="app-section">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 text-center mb-5">
            <img :src="umkcLogo" alt="UMKC" height="150" width="275" />
            <h1 class="app-heading">GTA Qualification Information</h1>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-lg-9">
            <div class="app-card p-4 p-md-5">
              <h2 class="h4 mb-3">Applicants are evaluated on</h2>
              <ul>
                <li v-for="item in criteria" :key="item">{{ item }}</li>
              </ul>
              <p>
                These factors are compiled into an overall rating out of 10.
              </p>

              <h2 class="h4 mb-3 mt-5">Further information</h2>
              <ul>
                <li>
                  You must be GTA certified to work as a lab instructor. See the
                  <a
                    class="app-link"
                    href="https://catalog.umkc.edu/general-graduate-academic-regulations-information/international-graduate-student-academic-regulations/"
                  >
                    graduate academic regulations
                  </a>
                  for the certification process.
                </li>
                <li>
                  If you are not GTA certified, you may only apply for grader
                  positions.
                </li>
                <li>
                  GTA certification for international students can only be
                  waived with a previous degree from a US institution.
                </li>
                <li>
                  International F-1 students are limited to 20 hours per week;
                  domestic students and PR card holders to 28 hours per week.
                </li>
                <li>
                  Undergraduates may only apply to grade a course they have
                  already taken at UMKC.
                </li>
                <li>
                  Master's students may only apply to grade undergraduate
                  courses taken during their previous course of study, and
                  graduate-level classes taken at UMKC with a grade of A, A- or
                  B+.
                </li>
                <li>
                  PhD students may be considered as a grader for any class,
                  based on feedback from their advisor.
                </li>
                <li>
                  Questions: contact the School of Graduate Studies at
                  <a class="app-link" href="mailto:umkcsgs@umkc.edu">
                    umkcsgs@umkc.edu
                  </a>
                  or 816-235-1301.
                </li>
              </ul>

              <p class="mb-0">
                Do not attach a CV, cover letter or reference letters — they are
                not considered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
</template>
