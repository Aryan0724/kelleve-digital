import sys

with open('src/components/dashboard/CompleteProfileTab.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if i == 946:
        # Start of replacement
        new_lines.append(line)
        new_lines.append('''                {!isProfileComplete ? (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50/50 rounded-lg backdrop-blur-[1px]">
                    <div className="bg-white px-6 py-3 rounded-full shadow border flex items-center text-slate-500 font-medium">
                      <Lock className="w-4 h-4 mr-2" /> Complete Step 1 First
                    </div>
                  </div>
                ) : (
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-indigo-900 flex items-center"><ShieldCheck className="w-4 h-4 mr-2" /> Ready for Verification</h4>
                      <p className="text-sm text-indigo-800 mt-1">Please head over to the <strong>Verification</strong> section from your sidebar menu to upload your official documents and get verified.</p>
                    </div>
                  </div>
                )}\n''')
        skip = True
    elif skip and i == 1014:
        # End of replacement, resume adding lines
        skip = False
    elif not skip:
        new_lines.append(line)

with open('src/components/dashboard/CompleteProfileTab.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Replaced successfully")
