"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getSession } from "../../authContext";

interface Job {
  id: string;
  title: string;
  description?: string;
}

export default function List() {
  const params = useParams();
  const listId = params.listId as string;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.history.replaceState({}, "", "/list");
    const fetchJobs = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/lists/${listId}/jobs`);
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (listId) {
      fetchJobs();
    }
  }, [listId]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Jobs</h1>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs in this list yet.</p>
      ) : (
        <ul className="space-y-2">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link
                href={`/home/list/${listId}/job/${job.id}`}
                className="block p-3 rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-500 transition-colors"
              >
                <p className="font-semibold text-blue-600 hover:underline">
                  {job.title}
                </p>
                {job.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {job.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
