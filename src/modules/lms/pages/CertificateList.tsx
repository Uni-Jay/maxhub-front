import { motion } from 'framer-motion';
import { Award, Download, Share2, Star, Calendar, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const CERTIFICATES = [
  {
    id: 1,
    title: 'Certificate of Completion',
    course: 'SAT Intro Course',
    issueDate: '2026-04-30',
    score: 94,
    grade: 'Distinction',
    credentialId: 'KSAT-2026-0001',
    color: 'from-indigo-500 to-violet-600',
    instructor: 'Prof. Fatima Yusuf',
  },
  {
    id: 2,
    title: 'Certificate of Completion',
    course: 'SAT Test Strategies Fundamentals',
    issueDate: '2026-03-15',
    score: 88,
    grade: 'Merit',
    credentialId: 'KSAT-2026-0002',
    color: 'from-emerald-500 to-teal-600',
    instructor: 'Mr. James Eke',
  },
];

const GRADE_STYLE: Record<string, string> = {
  Distinction: 'bg-amber-100 text-amber-700',
  Merit: 'bg-indigo-100 text-indigo-700',
  Pass: 'bg-emerald-100 text-emerald-700',
};

export function CertificateList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
        <p className="text-sm text-gray-500 mt-0.5">Credentials earned from completed courses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Certificates', value: CERTIFICATES.length.toString(), color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Distinctions', value: CERTIFICATES.filter(c => c.grade === 'Distinction').length.toString(), color: 'text-amber-600 bg-amber-50' },
          { label: 'Avg Score', value: `${Math.round(CERTIFICATES.reduce((s, c) => s + c.score, 0) / CERTIFICATES.length)}%`, color: 'text-emerald-600 bg-emerald-50' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {CERTIFICATES.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Award className="w-16 h-16 mb-4" />
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">No certificates yet</p>
          <p className="text-sm mt-1">Complete a course to earn your first certificate</p>
          <Link to="/lms/courses"
            className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {CERTIFICATES.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Certificate Card — styled like an actual certificate */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition">
                {/* Top banner */}
                <div className={`bg-gradient-to-r ${cert.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
                  <div className="absolute right-8 bottom-0 w-16 h-16 bg-white/5 rounded-full" />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-white/90" />
                        <span className="text-sm font-medium text-white/90">Kurios SAT Academy</span>
                      </div>
                      <p className="text-xs text-white/70 uppercase tracking-widest mb-1">Certificate of Completion</p>
                      <h2 className="text-xl font-bold">{cert.course}</h2>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full bg-white/20 text-sm font-semibold`}>
                        {cert.grade}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Issued</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{cert.issueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs text-gray-500">Final Score</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{cert.score}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Instructor</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{cert.instructor}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Credential ID</p>
                      <p className="text-sm font-mono font-medium text-indigo-600">{cert.credentialId}</p>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mb-5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Score</span>
                      <span className={`font-semibold ${GRADE_STYLE[cert.grade]?.includes('amber') ? 'text-amber-600' : 'text-indigo-600'}`}>{cert.grade}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${cert.color}`}
                        style={{ width: `${cert.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${cert.color} hover:opacity-90 transition`}>
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upcoming */}
      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-500" />
          Certificates in progress
        </h3>
        <p className="text-sm text-gray-500 mb-4">Complete these courses to earn more certificates</p>
        <div className="space-y-2">
          {[
            { course: 'SAT Mathematics Prep', progress: 72, color: 'from-indigo-500 to-violet-600' },
            { course: 'SAT English & Writing', progress: 55, color: 'from-emerald-500 to-teal-600' },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">{c.course}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{c.progress}%</span>
                </div>
                <div className="h-1.5 bg-white dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-1.5 rounded-full bg-gradient-to-r ${c.color}`} style={{ width: `${c.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CertificateList;
