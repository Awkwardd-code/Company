export default function TeamPage() {
    const teamMembers = [
        {
            name: "Adrio Devid",
            role: "Lead Developer",
            description: "Adrio leads our development team with expertise in frontend technologies.",
            image: "https://via.placeholder.com/150",
        },
        {
            name: "Maria Smith",
            role: "UI/UX Designer",
            description: "Maria crafts intuitive and beautiful user experiences.",
            image: "https://via.placeholder.com/150",
        },
        {
            name: "James Carter",
            role: "Backend Engineer",
            description: "James ensures our systems are robust and scalable.",
            image: "https://via.placeholder.com/150",
        },
        {
            name: "Emily Brown",
            role: "Product Manager",
            description: "Emily drives our product vision and strategy.",
            image: "https://via.placeholder.com/150",
        },
    ];

    return (
        <div className="min-h-screen bg-transparent px-4 py-12">
            {/* New Hero Section */}
            <div className="relative text-center mb-16 py-16">
                {/* Frosted Glass Background for Hero */}
                <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-md"></div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                        Welcome to Our Team
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl mb-6">
                        We are a group of passionate innovators working together to create
                        cutting-edge solutions. Meet the brilliant minds behind our success!
                    </p>
                    <a
                        href="#team"
                        className="inline-block bg-blue-500 dark:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                    >
                        Meet the Team
                    </a>
                </div>
            </div>

            {/* Existing Section Title */}
            <div
                className="relative mx-auto mb-12 max-w-[620px] pt-6 text-center md:mb-20 lg:pt-16"
                data-wow-delay=".2s"
            >
                <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 text-[40px] sm:text-[60px] lg:text-[95px] font-extrabold leading-none opacity-20"
                    style={{
                        background: 'linear-gradient(180deg, rgba(74, 108, 247, 0.4) 0%, rgba(74, 108, 247, 0) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    TEAM
                </span>

                <h2 className="font-heading text-dark mb-5 text-3xl font-semibold sm:text-4xl md:text-[50px] md:leading-[60px] dark:text-white">
                    Our Unique & Awesome Core Features
                </h2>
                <p className="text-dark-text text-base dark:text-gray-400">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In convallis
                    tortor eros. Donec vitae tortor lacus. Phasellus aliquam ante in
                    maximus.
                </p>
            </div>

            {/* Team Members Grid */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-lg shadow-[0_6px_30px_rgba(150,150,150,0.4)] dark:shadow-[0_6px_30px_rgba(100,100,100,0.5)] overflow-hidden text-center"
                        >
                            {/* Member Image */}
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-32 h-32 mx-auto mt-6 rounded-full object-cover border-4 border-white dark:border-gray-800"
                            />

                            {/* Member Info */}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                    {member.name}
                                </h2>
                                <p className="text-blue-500 dark:text-blue-400 text-sm mb-3">
                                    {member.role}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {member.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}