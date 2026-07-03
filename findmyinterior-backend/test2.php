$q = App\Models\WorkerJob::whereRaw("LOWER(skills_required::text) LIKE ?", ["%carpenter%"]); echo $q->count();
