import { Award, Users, TrendingUp, ChevronDown } from "lucide-react";
import { getHeroContent } from "@/features/hero/lib/actions";

export async function HeroSection() {
	const heroContent = await getHeroContent();

	const defaultContent = {
		title: "Engineering Excellence",
		subtitle: "CV Reswara Praptama",
		description:
			"Delivering innovative engineering solutions with precision, expertise, and commitment to excellence. Your trusted partner for complex engineering challenges.",
	};

	const content = heroContent || defaultContent;

	return (
		<div className="relative min-h-screen flex items-center bg-white overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute top-20 right-20 w-72 h-72 bg-red-600 rounded-full blur-3xl"></div>
				<div className="absolute bottom-20 left-20 w-96 h-96 bg-gray-900 rounded-full blur-3xl"></div>
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					<div className="text-center lg:text-left animate-fade-in">
						<div className="inline-block bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
							{content.subtitle}
						</div>

						<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight [animation-delay:200ms]">
							{content.title.split(" ")[0]}
							<span className="block text-red-600">
								{content.title.split(" ").slice(1).join(" ")}
							</span>
						</h1>

						<p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl [animation-delay:400ms]">
							{content.description}
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start [animation-delay:600ms]">
							<button className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
								Get Started
							</button>
							<button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-red-600 hover:text-red-600 transition-all duration-300">
								Learn More
							</button>
						</div>
					</div>

					<div className="relative animate-fade-in [animation-delay:500ms]">
						<div className="relative">
							{/* Main Card */}
							<div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 text-center transform hover:scale-105 transition-all duration-500">
								<div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
									<span className="text-white font-bold text-2xl">RP</span>
								</div>
								<h3 className="text-2xl font-bold text-gray-900 mb-3">
									Reswara Praptama
								</h3>
								<p className="text-gray-600 mb-6">
									Professional Engineering Consultant
								</p>

								{/* Stats */}
								<div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
									<div className="text-center">
										<div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-2">
											<Award className="w-6 h-6 text-red-600" />
										</div>
										<div className="text-2xl font-bold text-gray-900">10+</div>
										<div className="text-sm text-gray-600">Years</div>
									</div>
									<div className="text-center">
										<div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-2">
											<Users className="w-6 h-6 text-red-600" />
										</div>
										<div className="text-2xl font-bold text-gray-900">50+</div>
										<div className="text-sm text-gray-600">Projects</div>
									</div>
									<div className="text-center">
										<div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-2">
											<TrendingUp className="w-6 h-6 text-red-600" />
										</div>
										<div className="text-2xl font-bold text-gray-900">98%</div>
										<div className="text-sm text-gray-600">Success</div>
									</div>
								</div>
							</div>

							{/* Floating Elements */}
							<div className="absolute -top-4 -right-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
								<span className="text-red-600 font-bold text-sm">NEW</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
				<ChevronDown size={32} className="text-gray-400" />
			</div>
		</div>
	);
}
