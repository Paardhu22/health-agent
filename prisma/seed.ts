// Prisma Seed Script - Populate initial data
import { PrismaClient, DietPreference, ActivityLevel, HealthGoal } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Doctors
  const doctors = [
    {
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@healthagent.com',
      phone: '+91 98765 43210',
      specialization: 'General Physician',
      qualification: 'MBBS, MD (Internal Medicine)',
      experience: 12,
      consultationFee: 500,
      bio: 'Dr. Priya Sharma is a highly experienced general physician specializing in preventive healthcare and chronic disease management.',
      rating: 4.8,
      reviewCount: 245,
    },
    {
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@healthagent.com',
      phone: '+91 98765 43211',
      specialization: 'Cardiologist',
      qualification: 'MBBS, DM (Cardiology)',
      experience: 15,
      consultationFee: 800,
      bio: 'Dr. Rajesh Kumar is a renowned cardiologist with expertise in interventional cardiology and heart disease prevention.',
      rating: 4.9,
      reviewCount: 312,
    },
    {
      name: 'Dr. Anjali Rao',
      email: 'anjali.rao@healthagent.com',
      phone: '+91 98765 43212',
      specialization: 'Nutritionist',
      qualification: 'MSc Nutrition, PhD (Clinical Nutrition)',
      experience: 10,
      consultationFee: 600,
      bio: 'Dr. Anjali Rao specializes in clinical nutrition and helps patients achieve their health goals through personalized diet plans.',
      rating: 4.7,
      reviewCount: 198,
    },
    {
      name: 'Dr. Vikram Singh',
      email: 'vikram.singh@healthagent.com',
      phone: '+91 98765 43213',
      specialization: 'Orthopedic',
      qualification: 'MBBS, MS (Orthopedics)',
      experience: 18,
      consultationFee: 750,
      bio: 'Dr. Vikram Singh is an expert orthopedic surgeon specializing in sports injuries and joint replacement surgeries.',
      rating: 4.8,
      reviewCount: 276,
    },
    {
      name: 'Dr. Meera Patel',
      email: 'meera.patel@healthagent.com',
      phone: '+91 98765 43214',
      specialization: 'Endocrinologist',
      qualification: 'MBBS, DM (Endocrinology)',
      experience: 14,
      consultationFee: 700,
      bio: 'Dr. Meera Patel specializes in diabetes management, thyroid disorders, and hormonal imbalances.',
      rating: 4.9,
      reviewCount: 289,
    },
    {
      name: 'Dr. Arjun Menon',
      email: 'arjun.menon@healthagent.com',
      phone: '+91 98765 43215',
      specialization: 'Psychiatrist',
      qualification: 'MBBS, MD (Psychiatry)',
      experience: 11,
      consultationFee: 650,
      bio: 'Dr. Arjun Menon focuses on mental health, stress management, and cognitive behavioral therapy.',
      rating: 4.6,
      reviewCount: 167,
    },
    {
      name: 'Dr. Sanya Gupta',
      email: 'sanya.gupta@healthagent.com',
      phone: '+91 98765 43216',
      specialization: 'Dermatologist',
      qualification: 'MBBS, MD (Dermatology)',
      experience: 9,
      consultationFee: 550,
      bio: 'Dr. Sanya Gupta is a skilled dermatologist treating various skin conditions and offering cosmetic dermatology services.',
      rating: 4.7,
      reviewCount: 203,
    },
    {
      name: 'Dr. Kiran Reddy',
      email: 'kiran.reddy@healthagent.com',
      phone: '+91 98765 43217',
      specialization: 'Physiotherapist',
      qualification: 'BPT, MPT (Sports Physiotherapy)',
      experience: 8,
      consultationFee: 400,
      bio: 'Dr. Kiran Reddy specializes in sports rehabilitation, post-surgical recovery, and chronic pain management.',
      rating: 4.8,
      reviewCount: 156,
    },
  ];

  for (const doctor of doctors) {
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email: doctor.email },
    });

    if (!existingDoctor) {
      const createdDoctor = await prisma.doctor.create({
        data: doctor,
      });

      // Create availability for each doctor (Monday to Saturday)
      const availabilities = [];
      for (let day = 1; day <= 6; day++) {
        availabilities.push({
          doctorId: createdDoctor.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '13:00',
          slotDuration: 30,
        });
        availabilities.push({
          doctorId: createdDoctor.id,
          dayOfWeek: day,
          startTime: '14:00',
          endTime: '18:00',
          slotDuration: 30,
        });
      }

      await prisma.doctorAvailability.createMany({
        data: availabilities,
      });

      console.log(`✅ Created doctor: ${doctor.name}`);
    } else {
      console.log(`⏭️  Doctor already exists: ${doctor.name}`);
    }
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
