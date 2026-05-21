"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, Button } from "@daracademy/ui";

interface StudentProfile {
  gradeLevel?: number;
  school?: string;
  subjects: string[];
  learningGoals?: string;
  availability?: string;
  preferredLearning?: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfile>({
    gradeLevel: undefined,
    school: "",
    subjects: [],
    learningGoals: "",
    availability: "",
    preferredLearning: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Profile data would be fetched from API in real implementation
      // For now, we'll use placeholder data
      const profileData: StudentProfile = {
        gradeLevel: 10,
        school: "Example High School",
        subjects: ["Mathematics", "English"],
        learningGoals: "Improve grades and college preparation",
        availability: "Weekday evenings and weekends",
        preferredLearning: "Interactive sessions with practice problems",
      };
      setProfile(profileData);
      setFormData(profileData);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleInputChange = (
    field: keyof StudentProfile,
    value: string | number | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // API call would be made here
      setProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const subjectOptions = [
    "Mathematics",
    "English",
    "Science",
    "History",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
  ];

  const toggleSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  return (
    <div className="p-8 space-y-8 max-w-3xl">
      {/* Header */}
      <section>
        <h1 className="text-4xl font-bold text-navy mb-2">Your Profile</h1>
        <p className="text-slate-blue/70">
          Manage your learning preferences and goals.
        </p>
      </section>

      {/* User Info */}
      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-navy mb-4">
              Account Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={session?.user?.name || ""}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-slate-blue/20 bg-slate-blue/5 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-slate-blue/20 bg-slate-blue/5 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Learning Profile */}
      <Card>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-navy">Learning Profile</h2>
            <Button
              variant={isEditing ? "secondary" : "primary"}
              size="sm"
              onClick={() =>
                isEditing ? handleSaveProfile() : setIsEditing(true)
              }
              disabled={saving}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>

          <div className="space-y-6">
            {/* Grade Level */}
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Grade Level
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.gradeLevel || ""}
                onChange={(e) =>
                  handleInputChange("gradeLevel", parseInt(e.target.value))
                }
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-lg border border-slate-blue/20 disabled:bg-slate-blue/5 disabled:cursor-not-allowed"
              />
            </div>

            {/* School */}
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                School
              </label>
              <input
                type="text"
                value={formData.school || ""}
                onChange={(e) => handleInputChange("school", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-lg border border-slate-blue/20 disabled:bg-slate-blue/5 disabled:cursor-not-allowed"
              />
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-sm font-medium text-navy mb-3">
                Subjects You Study
              </label>
              <div className="grid grid-cols-2 gap-2">
                {subjectOptions.map((subject) => (
                  <label
                    key={subject}
                    className={`px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                      formData.subjects.includes(subject)
                        ? "bg-navy text-ivory border-navy"
                        : "bg-slate-blue/5 border-slate-blue/20 text-navy"
                    } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={() => toggleSubject(subject)}
                      disabled={!isEditing}
                      className="mr-2"
                    />
                    {subject}
                  </label>
                ))}
              </div>
            </div>

            {/* Learning Goals */}
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Learning Goals
              </label>
              <textarea
                value={formData.learningGoals || ""}
                onChange={(e) =>
                  handleInputChange("learningGoals", e.target.value)
                }
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-slate-blue/20 disabled:bg-slate-blue/5 disabled:cursor-not-allowed"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Availability
              </label>
              <input
                type="text"
                placeholder="e.g., Weekday evenings and weekends"
                value={formData.availability || ""}
                onChange={(e) =>
                  handleInputChange("availability", e.target.value)
                }
                disabled={!isEditing}
                className="w-full px-4 py-2 rounded-lg border border-slate-blue/20 disabled:bg-slate-blue/5 disabled:cursor-not-allowed"
              />
            </div>

            {/* Preferred Learning */}
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Preferred Learning Style
              </label>
              <textarea
                value={formData.preferredLearning || ""}
                onChange={(e) =>
                  handleInputChange("preferredLearning", e.target.value)
                }
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-slate-blue/20 disabled:bg-slate-blue/5 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button
                variant="primary"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  if (profile) setFormData(profile);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
