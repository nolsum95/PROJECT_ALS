<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EnrollmentSampleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first CAI ID for foreign key
        $firstCaiId = DB::table('cai_tb')->first()?->cai_id ?? 1;

        // Sample names for 20 enrollees
        $names = [
            ['Maria', 'Santos', 'Garcia', 'Female', '1995-03-15'],
            ['Juan', 'Cruz', 'Reyes', 'Male', '1992-07-22'],
            ['Ana', 'Lopez', 'Mendoza', 'Female', '1998-11-08'],
            ['Pedro', 'Villanueva', 'Torres', 'Male', '1990-05-12'],
            ['Carmen', 'Dela Cruz', 'Ramos', 'Female', '1996-09-30'],
            ['Roberto', 'Gonzales', 'Flores', 'Male', '1993-12-18'],
            ['Elena', 'Morales', 'Castillo', 'Female', '1997-04-25'],
            ['Miguel', 'Hernandez', 'Jimenez', 'Male', '1991-08-14'],
            ['Isabel', 'Martinez', 'Romero', 'Female', '1999-01-07'],
            ['Carlos', 'Sanchez', 'Navarro', 'Male', '1994-06-03'],
            ['Rosa', 'Perez', 'Vargas', 'Female', '1992-10-20'],
            ['Antonio', 'Rodriguez', 'Molina', 'Male', '1995-02-28'],
            ['Patricia', 'Fernandez', 'Herrera', 'Female', '1998-07-16'],
            ['Francisco', 'Gutierrez', 'Medina', 'Male', '1990-11-09'],
            ['Teresa', 'Ruiz', 'Aguilar', 'Female', '1996-05-24'],
            ['Manuel', 'Diaz', 'Vega', 'Male', '1993-09-11'],
            ['Dolores', 'Moreno', 'Silva', 'Female', '1997-12-05'],
            ['Jose', 'Alvarez', 'Castro', 'Male', '1991-03-19'],
            ['Concepcion', 'Romero', 'Ortega', 'Female', '1999-08-02'],
            ['Ramon', 'Munoz', 'Delgado', 'Male', '1994-01-26'],
        ];

        foreach ($names as $index => $name) {
            $enrollmentId = DB::table('enrollment_alpha_tb')->insertGetId([
                'fk_cai_id' => $firstCaiId,
                'firstname' => $name[0],
                'middlename' => $name[1],
                'lastname' => $name[2],
                'birthdate' => $name[4],
                'gender' => $name[3],
                'extension_name' => '',
                'mobile_no' => '0917' . str_pad($index + 1000000, 7, '0', STR_PAD_LEFT),
                'email_address' => strtolower($name[0] . '.' . $name[2] . '@email.com'),
                'religion' => 'Catholic',
                'mother_tongue' => 'Tagalog',
                'civil_status' => $index % 3 == 0 ? 'Married' : 'Single',
                'enrollee_status' => 'Applied',
                'date_enrolled' => now(),
            ]);

            // Insert related data
            $this->insertRelatedData($enrollmentId, $name);
        }

        $this->command->info('Successfully seeded 20 sample enrollees with "Applied" status!');
    }

    private function insertRelatedData($enrollmentId, $name)
    {
        // Address
        DB::table('enrollment_address_tb')->insert([
            'fk_enrollment_id' => $enrollmentId,
            'cur_house_no' => rand(1, 999),
            'cur_streetname' => 'Sample Street',
            'cur_barangay' => 'Sample Barangay',
            'cur_municipality' => 'Sample Municipality',
            'cur_province' => 'Sample Province',
            'cur_zip_code' => '1234',
            'perm_house_no' => rand(1, 999),
            'perm_streetname' => 'Permanent Street',
            'perm_barangay' => 'Permanent Barangay',
            'perm_municipality' => 'Permanent Municipality',
            'perm_province' => 'Permanent Province',
            'perm_zip_code' => '5678',
        ]);

        // Guardian
        DB::table('enrollment_guardian_tb')->insert([
            'fk_enrollment_id' => $enrollmentId,
            'pa_lastname' => $name[2],
            'pa_firstname' => 'Father ' . $name[0],
            'pa_middlename' => $name[1],
            'pa_occupation' => 'Farmer',
            'ma_lastname' => $name[2],
            'ma_firstname' => 'Mother ' . $name[0],
            'ma_middlename' => $name[1],
            'ma_occupation' => 'Housewife',
        ]);

        // Information
        DB::table('enrollment_information_tb')->insert([
            'fk_enrollment_id' => $enrollmentId,
            'lastLevelCompleted' => 'Elementary',
            'nonCompletionReason' => 'Financial',
            'custom_reason' => null,
            'hasAttendedAls' => 'No',
            'alsProgramAttended' => null,
            'hasCompletedAls' => 'No',
            'alsNonCompletedReason' => 'Not applicable',
        ]);

        // Household Status
        DB::table('household_status_tb')->insert([
            'fk_enrollment_id' => $enrollmentId,
            'isIndegenous' => 'No',
            'ipCommunityName' => null,
            'is4PsMember' => rand(0, 1) ? 'Yes' : 'No',
            'household_Id_4Ps' => rand(0, 1) ? '4PS-' . rand(100000, 999999) : null,
        ]);

        // PWD
        DB::table('enrollment_pwd_tb')->insert([
            'fk_enrollment_id' => $enrollmentId,
            'is_pwd' => 'No',
            'disability_name' => null,
            'spec_health_prob' => 'None',
            'visual_impairment' => 'None',
        ]);

        // Distance/Availability
        DB::table('distance_availability_tb')->insert([
            'fk_enrollment_id' => $enrollmentId,
            'distance_clc_km' => rand(1, 10) . ' km',
            'travel_hours_minutes' => rand(15, 120) . ' minutes',
            'transport_mode' => ['Walking', 'Tricycle', 'Jeepney', 'Motorcycle'][rand(0, 3)],
            'mon' => 'Available',
            'tue' => 'Available',
            'wed' => 'Available',
            'thur' => 'Available',
            'fri' => 'Available',
            'sat' => 'Not Available',
            'sun' => 'Not Available',
        ]);
    }
}
