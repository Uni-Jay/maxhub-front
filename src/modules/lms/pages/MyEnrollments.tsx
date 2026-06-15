import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Play, CheckCircle2, ArrowUpRight, Award } from 'lucide-react';

const ENROLLMENTS = [
  {
    id: 1, courseId: 1, title: 'SAT Mathematics Prep', instructor: 'Mr. James Eke',
    progress: 72, totalLessons: 13, doneLessons: 9,
    nextLesson: 'Quadratic Equations', enrolledDate: '2026-05-01',
    color: 'from-indigo-500 to-violet-600', status: 'active',
  },
  {
    id: 2, courseId: 2, title: 'SAT English & Writing', instructor: 'Ms. Grace Adeyemi',
    progress: 55, totalLessons: 10, doneLessons: 5,
    nextLesson: 'Essay Structure', enrolledDate: '2026-05-01',
    color: 'from-emerald-500 to-teal-600', status: 'active',
  },
  {
    id: 3, courseId: 3, title: 'SAT Critical Reading', instructor: 'Dr. Ade Okonkwo',
    progress: 88, totalLessons: 8, doneLessons: 7,
    nextLesson: 'Final Practice', enrolledDate: '2026-05-01',
    color: 'from-amber-500 to-orange-600', status: 'active',
  },
];

const COMPLETED = [
  {
    id: 4, courseId: 5, title: 'SAT Intro Course', instructor: 'Prof. Fatima Yusuf',
    progress: 100, totalLessons: 6, doneLessons: 6,
    completedDate: '2026-04-30', color: 'from-rose-500 to-pink-600', status: 'completed',
    certificate: true,
  },
];

export function MyEnrollments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Enrollments</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your enrolled courses and progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active Courses', value: ENROLLMENTS.length.toString(), color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Completed', value: COMPLETED.length.toString(), color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Certificates', value: COMPLETED.filter(c => c.certificate).length.toString(), color: 'bg-amber-50 text-amber-600' },
          { label: 'Avg Progress', value: `${Math.round(ENROLLMENTS.reduce((s, e) => s + e.progress, 0) / ENROLLMENTS.length)}%`, color: 'bg-violet-50 text-violet-600' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Active */}
      <div>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">In Progress</h2>
        <div className="space-y-4">
          {ENROLLMENTS.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${e.color} flex items-center justify-center flex-shrink-0`}>
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{e.title}</h3>
                        <p className="text-xs text-gray-500">{e.instructor}</p>
                      </div>
                      <Link to={`/lms/courses/${e.courseId}`}
                        className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 flex-shrink-0">
                        Open <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress — {e.doneLessons}/{e.totalLessons} lessons</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{e.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${e.color}`}
                          style={{ width: `${e.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    Next: <span className="font-medium text-gray-700 dark:text-gray-300">{e.nextLesson}</span>
                  </div>
                  <Link to={`/lms/courses/${e.courseId}`}>
                    <button className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r ${e.color} hover:opacity-90 transition`}>
                      <Play className="w-3 h-3" /> Continue
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Completed */}
      {COMPLETED.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Completed</h2>
          <div className="space-y-4">
            {COMPLETED.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${e.color} flex items-center justify-center flex-shrink-0`}>
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{e.title}</h3>
                          <p className="text-xs text-gray-500">{e.instructor}</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium flex-shrink-0">
                          Completed
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Completed on {e.completedDate}</p>
                    </div>
                  </div>
                  {e.certificate && (
                    <div className="mt-4 flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Certificate of Completion</span>
                      </div>
                      <Link to="/lms/certificates"
                        className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                        View <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Browse more */}
      <div className="text-center py-4">
        <Link to="/lms/courses"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">
          <BookOpen className="w-4 h-4" /> Browse More Courses
        </Link>
      </div>
    </div>
  );
}

export default MyEnrollments;
