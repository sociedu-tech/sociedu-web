import React from 'react';
import { Microscope } from 'lucide-react';
import { User as UserType } from '../../types';

interface ProfileProjectsProps {
  user: UserType;
}

export const ProfileProjects = ({ user }: ProfileProjectsProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-airbnb-dark mb-6 flex items-center gap-2">
        <Microscope size={24} className="text-blue-600" /> Nghiên cứu & Dự án
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user.researchProjects && user.researchProjects.length > 0 ? (
          user.researchProjects.map((project, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-airbnb-dark">{project.title}</h3>
                <span className="text-xs font-bold text-airbnb-red">{project.year}</span>
              </div>
              <p className="text-xs font-bold text-airbnb-gray uppercase tracking-tighter mb-2">{project.role}</p>
              <p className="text-sm text-airbnb-gray leading-relaxed">{project.description}</p>
            </div>
          ))
        ) : (
          <p className="text-airbnb-gray italic col-span-2">Chưa có thông tin dự án.</p>
        )}
      </div>
    </div>
  );
};
