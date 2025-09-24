<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EnrollmentAlpha;
use App\Models\EnrollmentAddress;
use App\Models\EnrollmentGuardian;
use App\Models\EnrollmentInfo;
use App\Models\EnrollmentPwd;
use App\Models\HouseholdStatus;
use App\Models\Clc;
use Carbon\Carbon;

class SampleEnrollmentSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $this->command->info('Creating 20 sample enrollment records with Filipino names...');

        // Get available CLCs
        $clcs = Clc::all();
        if ($clcs->isEmpty()) {
            $this->command->error('No CLCs found. Please create CLCs first.');
            return;
        }

        $sampleData = [
            [
                'firstname' => 'Maria',
                'middlename' => 'Santos',
                'lastname' => 'Cruz',
                'email' => 'maria.cruz@gmail.com',
                'mobile' => '09171234567',
                'birthdate' => '1995-03-15',
                'gender' => 'Female',
                'civil_status' => 'Single',
                'address' => ['Barangay San Jose', 'Quezon City', 'Metro Manila', '1100'],
                'guardian' => ['Juan Cruz', 'Father', '09181234567'],
                'education' => ['Grade 10', 'Financial difficulties'],
                'als_experience' => false
            ],
            [
                'firstname' => 'Jose',
                'middlename' => 'Dela',
                'lastname' => 'Reyes',
                'email' => 'jose.reyes@yahoo.com',
                'mobile' => '09281234568',
                'birthdate' => '1992-07-22',
                'gender' => 'Male',
                'civil_status' => 'Married',
                'address' => ['Barangay Poblacion', 'Marikina City', 'Metro Manila', '1800'],
                'guardian' => ['Ana Reyes', 'Wife', '09191234568'],
                'education' => ['Grade 8', 'Needed to work'],
                'als_experience' => false
            ],
            [
                'firstname' => 'Ana',
                'middlename' => 'Garcia',
                'lastname' => 'Mendoza',
                'email' => 'ana.mendoza@gmail.com',
                'mobile' => '09391234569',
                'birthdate' => '1988-11-08',
                'gender' => 'Female',
                'civil_status' => 'Married',
                'address' => ['Barangay Bagong Silang', 'Caloocan City', 'Metro Manila', '1400'],
                'guardian' => ['Pedro Mendoza', 'Husband', '09201234569'],
                'education' => ['Grade 6', 'Early marriage'],
                'als_experience' => true
            ],
            [
                'firstname' => 'Carlos',
                'middlename' => 'Villanueva',
                'lastname' => 'Torres',
                'email' => 'carlos.torres@gmail.com',
                'mobile' => '09401234570',
                'birthdate' => '1990-05-12',
                'gender' => 'Male',
                'civil_status' => 'Single',
                'address' => ['Barangay Tatalon', 'Quezon City', 'Metro Manila', '1113'],
                'guardian' => ['Rosa Torres', 'Mother', '09211234570'],
                'education' => ['Grade 9', 'Family responsibilities'],
                'als_experience' => false
            ],
            [
                'firstname' => 'Luz',
                'middlename' => 'Ramos',
                'lastname' => 'Gonzales',
                'email' => 'luz.gonzales@yahoo.com',
                'mobile' => '09511234571',
                'birthdate' => '1985-09-30',
                'gender' => 'Female',
                'civil_status' => 'Widow',
                'address' => ['Barangay Pasong Tamo', 'Makati City', 'Metro Manila', '1231'],
                'guardian' => ['Carmen Gonzales', 'Mother', '09221234571'],
                'education' => ['Grade 7', 'Financial problems'],
                'als_experience' => true
            ],
            [
                'firstname' => 'Roberto',
                'middlename' => 'Aquino',
                'lastname' => 'Fernandez',
                'email' => 'roberto.fernandez@gmail.com',
                'mobile' => '09621234572',
                'birthdate' => '1993-01-18',
                'gender' => 'Male',
                'civil_status' => 'Single',
                'address' => ['Barangay Libis', 'Quezon City', 'Metro Manila', '1110'],
                'guardian' => ['Elena Fernandez', 'Mother', '09231234572'],
                'education' => ['Grade 11', 'Health issues'],
                'als_experience' => false
            ],
            [
                'firstname' => 'Carmen',
                'middlename' => 'Bautista',
                'lastname' => 'Morales',
                'email' => 'carmen.morales@gmail.com',
                'mobile' => '09731234573',
                'birthdate' => '1987-12-03',
                'gender' => 'Female',
                'civil_status' => 'Married',
                'address' => ['Barangay Kamuning', 'Quezon City', 'Metro Manila', '1103'],
                'guardian' => ['Miguel Morales', 'Husband', '09241234573'],
                'education' => ['Grade 8', 'Pregnancy'],
                'als_experience' => false
            ],
            [
                'firstname' => 'Eduardo',
                'middlename' => 'Castillo',
                'lastname' => 'Jimenez',
                'email' => 'eduardo.jimenez@yahoo.com',
                'mobile' => '09841234574',
                'birthdate' => '1991-04-25',
                'gender' => 'Male',
                'civil_status' => 'Single',
                'address' => ['Barangay Fairview', 'Quezon City', 'Metro Manila', '1118'],
                'guardian' => ['Remedios Jimenez', 'Mother', '09251234574'],
                'education' => ['Grade 10', 'Work obligations'],
                'als_experience' => true
            ],
            [
                'firstname' => 'Rosario',
                'middlename' => 'Herrera',
                'lastname' => 'Valdez',
                'email' => 'rosario.valdez@gmail.com',
                'mobile' => '09951234575',
                'birthdate' => '1989-08-14',
                'gender' => 'Female',
                'civil_status' => 'Separated',
                'address' => ['Barangay Commonwealth', 'Quezon City', 'Metro Manila', '1121'],
                'guardian' => ['Esperanza Valdez', 'Mother', '09261234575'],
                'education' => ['Grade 9', 'Family problems'],
                'als_experience' => false
            ],
            [
                'firstname' => 'Antonio',
                'middlename' => 'Navarro',
                'lastname' => 'Perez',
                'email' => 'antonio.perez@gmail.com',
                'mobile' => '09061234576',
                'birthdate' => '1994-06-07',
                'gender' => 'Male',
                'civil_status' => 'Single',
                'address' => ['Barangay Novaliches', 'Quezon City', 'Metro Manila', '1123'],
                'guardian' => ['Concepcion Perez', 'Mother', '09271234576'],
                'education' => ['Grade 6', 'No school nearby'],
                'als_experience' => false
            ],
            [
                'firstname' => 'Esperanza',
                'middlename' => 'Aguilar',
                'lastname' => 'Flores',
                'email' => 'esperanza.flores@yahoo.com',
                'mobile' => '09171234577',
                'birthdate' => '1986-10-19',
                'gender' => 'Female',
                'civil_status' => 'Married',
                'address' => ['Barangay Project 8', 'Quezon City', 'Metro Manila', '1106'],
                'guardian' => ['Fernando Flores', 'Husband', '09281234577'],
                'education' => ['Grade 7', 'Early marriage'],
                'als_experience' => true
            ],
            [
                'firstname' => 'Manuel',
                'middlename' => 'Ortega',
                'lastname' => 'Rivera',
                'email' => 'manuel.rivera@gmail.com',
                'mobile' => '09291234578',
                'birthdate' => '1992-02-28',
                'gender' => 'Male',
                'civil_status' => 'Single',
                'address' => ['Barangay Batasan Hills', 'Quezon City', 'Metro Manila', '1126'],
                'guardian' => ['Teresita Rivera', 'Mother', '09301234578'],
                'education' => ['Grade 8', 'Financial constraints'],
                'als_experience' => false
            ],
            [
                'firstname' => 'Teresita',
                'middlename' => 'Medina',
                'lastname' => 'Castro',
                'email' => 'teresita.castro@gmail.com',
                'mobile' => '09401234579',
                'birthdate' => '1984-07-11',
                'gender' => 'Female',
                'civil_status' => 'Married',
                'address' => ['Barangay Holy Spirit', 'Quezon City', 'Metro Manila', '1127'],
                'guardian' => ['Ricardo Castro', 'Husband', '09311234579'],
                'education' => ['Grade 9', 'Child care responsibilities'],
                'als_experience' => false
            ],
            [
                'firstname' => 'Francisco',
                'middlename' => 'Vargas',
                'lastname' => 'Gutierrez',
                'email' => 'francisco.gutierrez@yahoo.com',
                'mobile' => '09511234580',
                'birthdate' => '1990-12-16',
                'gender' => 'Male',
                'civil_status' => 'Single',
                'address' => ['Barangay Tandang Sora', 'Quezon City', 'Metro Manila', '1116'],
                'guardian' => ['Soledad Gutierrez', 'Mother', '09321234580'],
                'education' => ['Grade 10', 'Work requirements'],
                'als_experience' => true
            ],
            [
                'firstname' => 'Remedios',
                'middlename' => 'Salazar',
                'lastname' => 'Diaz',
                'email' => 'remedios.diaz@gmail.com',
                'mobile' => '09621234581',
                'birthdate' => '1988-04-09',
                'gender' => 'Female',
                'civil_status' => 'Married',
                'address' => ['Barangay Payatas', 'Quezon City', 'Metro Manila', '1119'],
                'guardian' => ['Alfredo Diaz', 'Husband', '09331234581'],
                'education' => ['Grade 6', 'Family migration'],
                'als_experience' => false
            ],
            [
                'firstname' => 'Alfredo',
                'middlename' => 'Pascual',
                'lastname' => 'Moreno',
                'email' => 'alfredo.moreno@gmail.com',
                'mobile' => '09731234582',
                'birthdate' => '1993-09-21',
                'gender' => 'Male',
                'civil_status' => 'Single',
                'address' => ['Barangay Bagong Pag-asa', 'Quezon City', 'Metro Manila', '1105'],
                'guardian' => ['Milagros Moreno', 'Mother', '09341234582'],
                'education' => ['Grade 11', 'Health problems'],
                'als_experience' => false
            ],
            [
                'firstname' => 'Milagros',
                'middlename' => 'Sandoval',
                'lastname' => 'Ruiz',
                'email' => 'milagros.ruiz@yahoo.com',
                'mobile' => '09841234583',
                'birthdate' => '1987-01-04',
                'gender' => 'Female',
                'civil_status' => 'Widow',
                'address' => ['Barangay Culiat', 'Quezon City', 'Metro Manila', '1128'],
                'guardian' => ['Victoria Ruiz', 'Mother', '09351234583'],
                'education' => ['Grade 8', 'Spouse death'],
                'als_experience' => true
            ],
            [
                'firstname' => 'Vicente',
                'middlename' => 'Dominguez',
                'lastname' => 'Herrera',
                'email' => 'vicente.herrera@gmail.com',
                'mobile' => '09951234584',
                'birthdate' => '1991-11-27',
                'gender' => 'Male',
                'civil_status' => 'Single',
                'address' => ['Barangay Sauyo', 'Quezon City', 'Metro Manila', '1124'],
                'guardian' => ['Pacita Herrera', 'Mother', '09361234584'],
                'education' => ['Grade 9', 'Economic hardship'],
                'als_experience' => false
            ],
            [
                'firstname' => 'Pacita',
                'middlename' => 'Guerrero',
                'lastname' => 'Vega',
                'email' => 'pacita.vega@gmail.com',
                'mobile' => '09061234585',
                'birthdate' => '1985-05-13',
                'gender' => 'Female',
                'civil_status' => 'Married',
                'address' => ['Barangay Gulod', 'Quezon City', 'Metro Manila', '1109'],
                'guardian' => ['Ernesto Vega', 'Husband', '09371234585'],
                'education' => ['Grade 7', 'Distance to school'],
                'als_experience' => false
            ],
            [
                'firstname' => 'Ernesto',
                'middlename' => 'Lim',
                'lastname' => 'Santos',
                'email' => 'ernesto.santos@yahoo.com',
                'mobile' => '09171234586',
                'birthdate' => '1989-08-06',
                'gender' => 'Male',
                'civil_status' => 'Single',
                'address' => ['Barangay Apolonio Samson', 'Quezon City', 'Metro Manila', '1106'],
                'guardian' => ['Corazon Santos', 'Mother', '09381234586'],
                'education' => ['Grade 10', 'Work priorities'],
                'als_experience' => true
            ]
        ];

        foreach ($sampleData as $index => $data) {
            try {
                // Generate learner reference number
                $learnerRefNo = 'LRN-' . date('Y') . '-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT);
                
                // Get random CAI for assignment (enrollment system uses CAI, not CLC directly)
                $cais = \App\Models\Cai::all();
                $randomCai = $cais->isNotEmpty() ? $cais->random() : null;

                // Create main enrollment record
                $enrollment = EnrollmentAlpha::create([
                    'learner_ref_no' => $learnerRefNo,
                    'firstname' => $data['firstname'],
                    'middlename' => $data['middlename'],
                    'lastname' => $data['lastname'],
                    'email_address' => $data['email'],
                    'mobile_no' => $data['mobile'],
                    'birthdate' => $data['birthdate'],
                    'gender' => $data['gender'],
                    'extension_name' => '', // Required field
                    'religion' => ['Catholic', 'Protestant', 'Islam', 'Buddhist', 'Others'][rand(0, 4)],
                    'mother_tongue' => ['Tagalog', 'Cebuano', 'Ilocano', 'Hiligaynon', 'Waray'][rand(0, 4)],
                    'civil_status' => $data['civil_status'],
                    'fk_cai_id' => $randomCai ? $randomCai->cai_id : null,
                    'enrollee_status' => 'Applied', // Set to Applied as requested
                    'date_enrolled' => Carbon::now()->subDays(rand(1, 60))->toDateString(),
                ]);

                // Create address record
                EnrollmentAddress::create([
                    'fk_enrollment_id' => $enrollment->enrollment_id,
                    'cur_house_no' => (string)rand(1, 999),
                    'cur_streetname' => $data['address'][0],
                    'cur_barangay' => $data['address'][0],
                    'cur_municipality' => $data['address'][1],
                    'cur_province' => $data['address'][2],
                    'cur_zip_code' => $data['address'][3],
                    'perm_house_no' => (string)rand(1, 999),
                    'perm_streetname' => $data['address'][0],
                    'perm_barangay' => $data['address'][0],
                    'perm_municipality' => $data['address'][1],
                    'perm_province' => $data['address'][2],
                    'perm_zip_code' => $data['address'][3],
                ]);

                // Create guardian record (using parent structure from backend)
                $guardianNames = explode(' ', $data['guardian'][0]);
                $guardianFirstname = $guardianNames[0] ?? '';
                $guardianLastname = $guardianNames[1] ?? '';
                
                if ($data['guardian'][1] === 'Father' || $data['guardian'][1] === 'Husband') {
                    EnrollmentGuardian::create([
                        'fk_enrollment_id' => $enrollment->enrollment_id,
                        'pa_firstname' => $guardianFirstname,
                        'pa_lastname' => $guardianLastname,
                        'pa_middlename' => '',
                        'pa_occupation' => ['Farmer', 'Driver', 'Carpenter', 'Vendor', 'Security Guard'][rand(0, 4)],
                        'ma_firstname' => null,
                        'ma_lastname' => null,
                        'ma_middlename' => null,
                        'ma_occupation' => null,
                    ]);
                } else {
                    EnrollmentGuardian::create([
                        'fk_enrollment_id' => $enrollment->enrollment_id,
                        'pa_firstname' => null,
                        'pa_lastname' => null,
                        'pa_middlename' => null,
                        'pa_occupation' => null,
                        'ma_firstname' => $guardianFirstname,
                        'ma_lastname' => $guardianLastname,
                        'ma_middlename' => '',
                        'ma_occupation' => ['Housewife', 'Vendor', 'Teacher', 'Seamstress', 'Cook'][rand(0, 4)],
                    ]);
                }

                // Create education info record
                EnrollmentInfo::create([
                    'fk_enrollment_id' => $enrollment->enrollment_id,
                    'lastLevelCompleted' => $data['education'][0],
                    'nonCompletionReason' => $data['education'][1],
                    'custom_reason' => null,
                    'hasAttendedAls' => $data['als_experience'] ? 'Yes' : 'No',
                    'alsProgramAttended' => $data['als_experience'] ? 'A&E Elementary' : null,
                    'hasCompletedAls' => $data['als_experience'] ? (rand(0, 1) ? 'Yes' : 'No') : 'No',
                    'alsNonCompletedReason' => $data['als_experience'] && rand(0, 1) ? 'Time constraints' : null,
                ]);

                // Create PWD record (random disability status)
                $isPwd = rand(0, 10) > 8 ? 'Yes' : 'No'; // 20% PWD
                EnrollmentPwd::create([
                    'fk_enrollment_id' => $enrollment->enrollment_id,
                    'is_pwd' => $isPwd,
                    'disability_name' => $isPwd === 'Yes' ? 'Visual Impairment' : null,
                    'spec_health_prob' => $isPwd === 'Yes' ? 'None' : 'None',
                    'visual_impairment' => $isPwd === 'Yes' ? 'Mild' : 'None',
                ]);

                // Create household status record
                HouseholdStatus::create([
                    'fk_enrollment_id' => $enrollment->enrollment_id,
                    'isIndegenous' => rand(0, 10) > 8 ? 'Yes' : 'No',
                    'ipCommunityName' => rand(0, 10) > 8 ? 'Tagalog Community' : null,
                    'is4PsMember' => rand(0, 1) ? 'Yes' : 'No',
                    'household_Id_4Ps' => rand(0, 1) ? 'HH-' . rand(100000, 999999) : null,
                ]);

                $this->command->info("Created enrollment for: {$data['firstname']} {$data['lastname']} (LRN: {$learnerRefNo})");

            } catch (\Exception $e) {
                $this->command->error("Error creating enrollment for {$data['firstname']} {$data['lastname']}: " . $e->getMessage());
            }
        }

        $this->command->info('Sample enrollment seeding completed! Created 20 enrollment records with Filipino names.');
    }
}
