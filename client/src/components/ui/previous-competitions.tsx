import { Link } from "wouter";
import { caseStudies } from "@/data/case-studies";

export default function PreviousCompetitions() {
  return (
    <section className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#333333]">往届优秀案例</h2>
          <p className="text-gray-600 mt-2">精彩瞬间，永恒回忆</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {caseStudies.map((project) => (
            <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all flex flex-col">
              <div>
                <img 
                  src={project.images[0]} 
                  alt={project.title} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.png';
                  }}
                />
                <div className="p-6 pb-0">
                  <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                </div>
              </div>
              <div className="mt-auto p-6 pt-2 flex items-end min-h-[56px]">
                {project.customLink ? (
                  <a 
                    href={project.customLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1E88E5] hover:text-blue-700 font-medium inline-flex items-center"
                  >
                    查看详情 <i className="fas fa-arrow-right ml-2"></i>
                  </a>
                ) : (
                  <Link href={`/case-details/${project.id}`}>
                    <a className="text-[#1E88E5] hover:text-blue-700 font-medium inline-flex items-center">
                      查看详情 <i className="fas fa-arrow-right ml-2"></i>
                    </a>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
