import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const RegisterClubModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    collegeCode: '',
    clubName: '',
    category: 'Arts',
    yearEstablished: '',
    clubCode: '',
    description: '',

    facultyInCharge: '',
    facultyDepartment: '',
    facultyEmail: '',
    facultyContact: '',

    presidentName: '',
    presidentRegNo: '',
    vicePresidentName: '',
    vicePresidentRegNo: '',
    secretaryName: '',
    secretaryRegNo: '',

    meetingFrequency: '',
    expectedMembers: '',
    plannedActivities: '',

    estimatedBudget: '',
    adminRemarks: '',
  });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/clubs/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || 'Registration failed');
        setLoading(false);
        return;
      }

      alert('Club registered successfully');
      onClose();
    } catch (error) {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-50 dark:bg-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-700 transition-theme rounded-l-2xl rounded-r-none custom-scrollbar">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 rounded-tl-2xl rounded-tr-none">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Club Registration Form
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Club Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="collegeCode" onChange={handleChange} className="input" placeholder="College Code" />
              <input name="clubName" onChange={handleChange} className="input" placeholder="Club Name" />
              <select name="category" onChange={handleChange} className="input">
                <option>Arts</option>
                <option>Technology</option>
                <option>Sports</option>
                <option>Social Service</option>
                <option>Others</option>
              </select>
              <input name="yearEstablished" onChange={handleChange} className="input" placeholder="Year of Establishment" />
              <input name="clubCode" onChange={handleChange} className="input" placeholder="Club Code" />
            </div>

            <textarea
              name="description"
              rows={3}
              onChange={handleChange}
              placeholder="Club Description"
              className="input resize-none"
            />
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Faculty and Administration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="facultyInCharge" onChange={handleChange} className="input" placeholder="Faculty In-Charge" />
              <input name="facultyDepartment" onChange={handleChange} className="input" placeholder="Department" />
              <input name="facultyEmail" onChange={handleChange} className="input" placeholder="Email" />
              <input name="facultyContact" onChange={handleChange} className="input" placeholder="Contact Number" />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Student Leadership
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="presidentName" onChange={handleChange} className="input" placeholder="President Name" />
              <input name="vicePresidentName" onChange={handleChange} className="input" placeholder="Vice President Name" />
              <input name="secretaryName" onChange={handleChange} className="input" placeholder="Secretary Name" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="presidentRegNo" onChange={handleChange} className="input" placeholder="President Reg No" />
              <input name="vicePresidentRegNo" onChange={handleChange} className="input" placeholder="Vice President Reg No" />
              <input name="secretaryRegNo" onChange={handleChange} className="input" placeholder="Secretary Reg No" />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Operations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="meetingFrequency" onChange={handleChange} className="input" placeholder="Meeting Frequency" />
              <input name="expectedMembers" onChange={handleChange} className="input" placeholder="Expected Members" />
            </div>

            <textarea
              name="plannedActivities"
              rows={3}
              onChange={handleChange}
              placeholder="Planned Activities"
              className="input resize-none"
            />
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Budget
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="estimatedBudget" onChange={handleChange} className="input" placeholder="Estimated Budget" />
              <textarea
                name="adminRemarks"
                rows={2}
                onChange={handleChange}
                placeholder="Admin Remarks"
                className="input resize-none"
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 bg-gray-100 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 rounded-bl-2xl rounded-br-none">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>

        {/* Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(120, 120, 120, 0.4);
            border-radius: 999px;
          }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(120, 120, 120, 0.6);
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(120, 120, 120, 0.5) transparent;
          }

          .input {
            width: 100%;
            border-radius: 0.5rem;
            border: 1px solid rgb(209 213 219);
            background-color: white;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            color: rgb(17 24 39);
          }
          .dark .input {
            border-color: rgb(63 63 70);
            background-color: rgb(39 39 42);
            color: rgb(244 244 245);
          }
          .input:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgb(99 102 241);
            border-color: rgb(99 102 241);
          }
        `}</style>
      </div>
    </div>
  );
};

export default RegisterClubModal;
