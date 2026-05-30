import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import BusinessCard from '../components/BusinessCard';
import { businessService } from '../services/api';
import { Search, Loader2, AlertCircle, Plus, X, LayoutGrid, ChevronDown, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const BusinessList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categorySubMap = {
        "Advertising": ["All Sub-Categories", "Outdoor Advertising", "Digital Marketing Agencies", "Social Media Marketing", "Print Advertising", "Radio & TV Ads", "Brand Design Studios", "SEO & SEM Services", "Influencer Marketing", "Photography Studios", "Video Production"],
        "Advocate & Legal": ["All Sub-Categories", "Civil Lawyers", "Criminal Lawyers", "Family Law Advocates", "Property & Real Estate Lawyers", "Consumer Court Advocates", "Labor & Employment Lawyers", "Corporate Lawyers", "Notary Services", "Legal Document Services", "Cyber Law Consultants"],
        "Agriculture": ["All Sub-Categories", "Seed Suppliers", "Fertilizer Dealers", "Pesticide Shops", "Irrigation Equipment", "Farm Machinery Dealers", "Organic Farming Consultants", "Soil Testing Labs", "Agri Input Shops", "Poultry & Livestock Supplies", "Cold Storage & Warehousing"],
        "Automobile": ["All Sub-Categories", "Car Showrooms", "Bike Showrooms", "Car Service Centers", "Bike Service Centers", "Spare Parts Shops", "Tyre & Battery Dealers", "Auto Body Works", "Driving Schools", "Used Vehicle Dealers", "EV Charging Stations"],
        "B2B Services": ["All Sub-Categories", "Wholesale Suppliers", "Raw Material Suppliers", "Industrial Equipment", "Packaging Solutions", "Export & Import Services", "Manufacturing Units", "Quality Testing Labs", "Consulting Services", "HR & Staffing", "Freight & Logistics"],
        "Banking & Finance": ["All Sub-Categories", "Banks", "Credit Cooperative Societies", "Microfinance Companies", "Insurance Agents", "Mutual Fund Advisors", "Loan Services", "Chit Fund Companies", "Money Transfer Services", "Stock Brokers", "Financial Planning Services"],
        "Banquets & Event Halls": ["All Sub-Categories", "Wedding Halls", "Conference Halls", "Mini Auditoriums", "Rooftop Venues", "Outdoor Event Spaces", "Community Halls", "Corporate Event Venues", "Birthday Party Halls", "Stage & Event Setup", "Heritage Venues"],
        "Bills & Recharge": ["All Sub-Categories", "Mobile Recharge Shops", "DTH & Cable Services", "Electricity Bill Payment", "Insurance Premium Collection", "Aadhaar & PAN Services", "Xerox & Printing Shops", "Bank & Fintech Agents", "Ticket Booking", "Online Bill Payment Centers", "Government Service Centers"],
        "Caterers": ["All Sub-Categories", "Wedding Caterers", "Corporate Caterers", "Tiffin Services", "Home-Based Caterers", "Mess & Canteen Services", "Diet & Health Food", "Vegan & Organic Food Caterers", "Live Counter Catering", "Mini Meals Providers", "Snack & Sweets Caterers"],
        "Civil Contractors": ["All Sub-Categories", "Building Contractors", "Road Construction", "Plumbing Services", "Interior Works", "Floor & Tile Work", "Painting Services", "Waterproofing Services", "Steel Fabrication", "Masonry & Brick Work", "Roofing Services"],
        "Construction Materials": ["All Sub-Categories", "Cement Dealers", "Sand & Aggregate Suppliers", "Bricks & Blocks", "TMT Steel Bars", "Roofing Sheets", "Plumbing Materials", "Paints & Coatings", "Wood & Timber", "Glass & Aluminium", "Waterproofing Products"],
        "Courier Services": ["All Sub-Categories", "Local Courier Services", "National Courier", "International Courier", "Document Courier", "Parcel Delivery", "Cold Chain Logistics", "Bulk Cargo Shipping", "Same Day Delivery", "E-Commerce Fulfillment", "Fragile Item Delivery"],
        "Daily Needs": ["All Sub-Categories", "Supermarkets & Grocery", "Milk & Dairy", "Vegetable & Fruit Shops", "Bakery & Bread", "Personal Care Products", "Stationery & Books", "Meat & Fish Shops", "Pet Food & Supplies", "Household Items", "Local Kirana Stores"],
        "Demand Services": ["All Sub-Categories", "Plumbers on Demand", "Electricians on Demand", "Carpenters on Demand", "Painters on Demand", "Cleaning Services", "Laundry & Dry Cleaning", "Home Nursing", "Babysitters & Nannies", "Elderly Care Services", "AC Technicians"],
        "Digital & IT Products": ["All Sub-Categories", "Software Solutions", "Web Development", "Mobile App Development", "IT Hardware", "Networking & WiFi Solutions", "Cloud Services", "Cybersecurity", "Digital Printing", "CCTV Installation", "Data Recovery"],
        "Doctors": ["All Sub-Categories", "General Physicians", "Pediatricians", "Gynecologists", "Orthopedic Doctors", "Cardiologists", "Neurologists", "ENT Specialists", "Dermatologists", "Psychiatrists", "Ophthalmologists"],
        "Education": ["All Sub-Categories", "Coaching Centre", "School / College"],
        "Electricals & Electronics": ["All Sub-Categories", "CCTV & Security", "CCTV & Security Systems", "Computer & Laptop Shops", "Computer Shop", "Electrical Shop", "Electrical Shops", "Electronics Showrooms", "Electronics Stores", "Generator & Inverter", "Home Appliance Shops", "LED & Lighting", "Mobile & Accessories", "Mobile Shop", "Solar Panel Dealers", "Wiring & Electricians"],
        "Hire Services": ["All Sub-Categories", "Tent & Decor Hire", "Sound System Hire", "Projector & AV Hire", "Vehicle Hire", "Furniture Hire", "Generator Hire", "Event Equipment Hire", "Costume Hire", "Catering Equipment Hire", "Photography Equipment Hire"],
        "Home Appliances": ["All Sub-Categories", "Refrigerators", "Washing Machines", "Air Conditioners", "Water Purifiers", "Mixers & Grinders", "Televisions", "Microwaves & OTG", "Fans & Coolers", "Geysers & Water Heaters", "Home Theater Systems"],
        "Hospitals & Clinics": ["All Sub-Categories", "Clinics", "Hospitals"],
        "Hotels & Restaurants": ["All Sub-Categories", "Budget Hotels", "Luxury Hotels", "Restaurants", "Dhabas & Mess", "Fast Food Outlets", "Cafes & Coffee Shops", "Cloud Kitchens", "Multi-Cuisine Restaurants", "South Indian Restaurants", "Rooftop Dining"],
        "IT & Software": ["All Sub-Categories", "Custom Software Development", "ERP Solutions", "CRM Software", "POS Systems", "Website Design & Hosting", "SEO & Digital Marketing", "Accounting Software", "School & College ERP", "Hospital Management Software", "E-Commerce Development"],
        "Insurance": ["All Sub-Categories", "Life Insurance", "Health Insurance", "Vehicle Insurance", "Home Insurance", "Crop Insurance", "Fire & Burglary Insurance", "Travel Insurance", "Group Insurance", "ULIP & Investment Plans", "Insurance Claim Consultants"],
        "Jewellery": ["All Sub-Categories", "Gold Jewellery Shops", "Silver Jewellery", "Diamond Jewellery", "Platinum Jewellery", "Imitation Jewellery", "Antique Jewellery", "Temple Jewellery", "Bridal Jewellery", "Gemstone & Rings", "Custom Jewellery Makers"],
        "Jobs": ["All Sub-Categories", "Job Placement Agencies", "Government Job Coaching", "Private Company Recruitment", "IT & Software Jobs", "Healthcare Recruitment", "Driver & Delivery Jobs", "Home-Based Work", "Internship Programs", "Blue-Collar Workforce", "Freelance Platforms"],
        "Labs & Diagnostics": ["All Sub-Categories", "Blood Test Labs", "Scan Centers", "X-Ray & MRI Centers", "Pathology Labs", "COVID Testing Centers", "DNA Testing Centers", "Eye Testing Centers", "Dental X-Ray Labs", "Home Sample Collection", "Molecular Diagnostic Labs"],
        "Organic Products": ["All Sub-Categories", "Organic Grocery Stores", "Organic Farms", "Herbal & Ayurvedic Products", "Cold-Pressed Oils", "Organic Dairy Products", "Natural Skincare", "Organic Pulses & Grains", "Eco-Friendly Products", "Health Supplements", "Organic Fertilizers"],
        "Packers & Movers": ["All Sub-Categories", "Local Shifting Services", "Inter-City Movers", "International Movers", "Vehicle Transport", "Office Relocation", "Home Relocation", "Warehouse & Storage", "Fragile Item Packing", "Bike & Car Transport", "Loading & Unloading Services"],
        "Pest Control": ["All Sub-Categories", "Cockroach Control", "Termite Treatment", "Mosquito Control", "Rat & Rodent Control", "Bed Bug Treatment", "General Disinfection", "Commercial Pest Control", "Wood Borer Treatment", "Fly Control", "Honeybee Removal"],
        "Printing Services": ["All Sub-Categories", "Visiting Card Printing", "Banner & Flex Printing", "Brochure & Flyer Printing", "Book Printing", "T-Shirt Printing", "Digital Printing Shops", "Offset Printing", "Wedding Invitation Printing", "Packaging Printing", "Stamp & Seal Makers"],
        "Real Estate": ["All Sub-Categories", "Residential Plots", "Commercial Plots", "Apartment Sales", "Villa & Independent Houses", "Land Brokers", "Property Management", "Interior Designers", "Architect Services", "Rental Properties", "Real Estate Consultants"],
        "Religious": ["All Sub-Categories", "Temples", "Churches", "Mosques", "Puja Item Shops", "Religious Book Stores", "Astrology & Numerology", "Vastu Consultants", "Event Pooja Services", "Prasad Distribution", "Spiritual Retreat Centers"],
        "Repairs": ["All Sub-Categories", "Mobile Phone Repair", "Laptop & Computer Repair", "Home Appliance Repair", "TV Repair", "AC Service & Repair", "Watch Repair", "Shoe Repair", "Bike Repair", "Car Denting & Painting", "Plumbing Repairs"],
        "Spa & Beauty": ["All Sub-Categories", "Beauty Salons", "Barber Shops", "Spa & Wellness Centers", "Nail Studios", "Makeup Artists", "Bridal Packages", "Skin Care Clinics", "Hair Transplant Clinics", "Threading & Waxing", "Tattoo Studios"],
        "Sports": ["All Sub-Categories", "Fitness Centers & Gyms", "Yoga Studios", "Cricket Academies", "Football Clubs", "Swimming Pools", "Badminton Courts", "Basketball Courts", "Sports Equipment Shops", "Martial Arts", "Cycling Clubs"],
        "Textiles & Garments": ["All Sub-Categories", "Saree Shops", "Dress Materials", "Readymade Garments", "Tailoring & Boutiques", "School Uniform Suppliers", "Fabric Wholesalers", "Embroidery & Zari Work", "Silk Sarees", "Western Wear Shops", "Kids Wear"],
        "Transport": ["All Sub-Categories", "Ambulance Services", "Auto Rickshaw", "Bike Taxi", "Bus Services", "Cab & Taxi", "Car Rentals", "Courier Bikes", "Goods Transport", "Logistics", "Lorry & Truck Transport", "Mini Van Services", "School Van", "Taxi & Cab", "Travel Agency"],
        "Travel & Tourism": ["All Sub-Categories", "Travel Agencies", "Tour Operators", "Pilgrimage Tours", "Adventure Travel", "Holiday Packages", "Visa Consultants", "Hotel Booking Services", "Foreign Exchange", "Car Rentals for Tours", "Cruise & Air Bookings"],
        "Wedding Services": ["All Sub-Categories", "Wedding Services"]
    };

    const tamilNaduDistricts = [
        "All Districts", "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
        "Dindigul", "Erode", "Kallakuruchi", "Kancheepuram", "Kanniyakumari", "Karur", "Krishnagiri",
        "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukottai",
        "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thiruvallur",
        "Thiruvarur", "Thoothukudi", "Tiruchirapalli", "Tirunelveli", "Tirupathur", "Tiruppur",
        "Tiruvannamalai", "Vellore", "Vilupuram", "Virudhunagar"
    ];

    const districtAssemblyMap = {
        "Chennai": [
            "All Assemblies", "Anna Nagar", "Chepauk-Thiruvallikeni", "Dr.Radhakrishnan Nagar", "Egmore",
            "Harbour", "Kolathur", "Mylapore", "Perambur", "Royapuram", "Saidapet",
            "Thiru-Vi-Ka-Nagar", "Thiyagarayanagar", "Thousand Lights", "Velachery", "Villivakkam", "Virugampakkam"
        ],
        "Coimbatore": [
            "All Assemblies", "Coimbatore North", "Coimbatore South", "Kavundampalayam", "Singanallur",
            "Sulur", "Thondamuthur", "Kinathukadavu", "Pollachi", "Valparai", "Mettupalayam"
        ],
        "Madurai": [
            "All Assemblies", "Madurai North", "Madurai South", "Madurai Central", "Madurai West",
            "Madurai East", "Melur", "Samayanallur", "Thirumangalam", "Thirupparankundram", "Usilampatti"
        ],
        "Kancheepuram": [
            "All Assemblies", "Kancheepuram", "Sriperumbudur", "Uthiramerur", "Alandur", "Pallavaram", "Tambaram"
        ],
        "Thiruvallur": [
            "All Assemblies", "Thiruvallur", "Avadi", "Poonamallee", "Ambattur", "Maduravoyal", "Gummidipoondi"
        ]
    };

    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'Hospitals & Clinics');
    const [subCategory, setSubCategory] = useState('All Sub-Categories');
    const [district, setDistrict] = useState('All Districts');
    const [assembly, setAssembly] = useState('All Assemblies');
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [finalizedSearch, setFinalizedSearch] = useState('');

    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        }
        const searchFromUrl = searchParams.get('search');
        if (searchFromUrl) {
            setSearchTerm(searchFromUrl);
            setFinalizedSearch(searchFromUrl);
        }
    }, [searchParams]);

    const handleCategorySelect = (cat) => {
        setSelectedCategory(cat);
        setSubCategory('All Sub-Categories');
        setDistrict('All Districts');
        setCurrentPage(1); // Reset to page 1
        if (cat === 'All Categories') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', cat);
        }
        setSearchParams(searchParams);
    };

    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                setLoading(true);
                const query = {
                    category: selectedCategory === 'All Categories' ? '' : selectedCategory,
                    subCategory: subCategory === 'All Sub-Categories' ? '' : subCategory,
                    district: district === 'All Districts' ? '' : district,
                    assembly: assembly === 'All Assemblies' ? '' : assembly,
                    search: finalizedSearch,
                    page: currentPage
                };
                const data = await businessService.getAll(query);
                let list = Array.isArray(data) ? data : (data.businesses || []);

                const seen = new Set();
                list = list.filter(item => {
                    const id = item._id || item.id;
                    if (seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });

                setBusinesses(list);
                setTotalCount(data.total || list.length);
                setLoading(false);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Could not load businesses. Please try again later.");
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, [selectedCategory, subCategory, district, assembly, finalizedSearch, currentPage]);

    const uniqueSubCategories = categorySubMap[selectedCategory] || ['All Sub-Categories'];

    const uniqueDistricts = tamilNaduDistricts;

    return (
        <main className="bg-white min-h-screen">
            <PageHeader
                title="Premium Business Directory"
                subtitle="Explore verified local services and specialized clinics curated for your quality needs."
            />

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs & Header */}
                    <div className="mb-14">
                        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                            <Link to="/" className="hover:text-rose-600 transition-colors">Home</Link>
                            <span>/</span>
                            <Link to="/business-list" className="hover:text-rose-600 transition-colors">Categories</Link>
                            <span>/</span>
                            <span className="text-slate-900">{selectedCategory}</span>
                        </nav>

                        <div className="flex flex-col gap-3 mb-4">
                            <span className="text-[12px] sm:text-[14px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2 sm:gap-3">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-600 animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.5)]"></div>
                                {new Intl.NumberFormat('en-IN').format(totalCount)} BUSINESSES FOUND
                            </span>
                            <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] uppercase">{selectedCategory}</h2>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
                        {/* Mobile Category Selector - Only visible on small screens */}
                        <div className="lg:hidden mb-8">
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-rose-600">
                                    <LayoutGrid size={18} />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategorySelect(e.target.value)}
                                    className="w-full bg-[#0f172a] text-white rounded-2xl p-5 pl-14 text-[11px] font-black uppercase tracking-[0.2em] outline-none shadow-2xl appearance-none border border-slate-800 transition-all focus:border-rose-500"
                                >
                                    <option value="All Categories">All Categories</option>
                                    {Object.keys(categorySubMap).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <ChevronDown size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Desktop Sidebar Filters - Hidden on mobile */}
                        <aside className="hidden lg:block lg:col-span-1">
                            <div className="bg-[#0f172a] rounded-[2rem] p-6 shadow-2xl sticky top-28 border border-slate-800 overflow-hidden">
                                <h4 className="text-sm font-black text-slate-400 mb-8 uppercase tracking-[0.2em] px-4">Categories</h4>
                                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                                    <ul className="space-y-1">
                                        {Object.keys(categorySubMap).map(cat => (
                                            <li key={cat}>
                                                {cat === 'Add Business' ? (
                                                    <Link
                                                        to="/add-business"
                                                        className="text-sm font-bold flex items-center justify-between w-full px-4 py-3.5 rounded-xl transition-all bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white mt-4 border border-emerald-500/20"
                                                    >
                                                        {cat}
                                                        <Plus size={16} />
                                                    </Link>
                                                ) : (
                                                    <button
                                                        onClick={() => handleCategorySelect(cat)}
                                                        className={`text-sm font-bold flex items-center justify-between w-full px-4 py-3.5 rounded-xl transition-all ${selectedCategory === cat
                                                            ? 'bg-rose-600 text-white shadow-lg shadow-blue-600/20'
                                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                                            }`}
                                                    >
                                                        {cat}
                                                        {selectedCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={() => { handleCategorySelect('All Categories'); setSearchTerm(''); }}
                                    className="w-full mt-6 py-4 bg-slate-800/50 text-slate-500 rounded-xl font-black text-xs uppercase tracking-widest hover:text-white hover:bg-slate-800 transition-all border border-slate-700/50"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </aside>

                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                            .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
                            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
                        `}} />

                        {/* Main Content Area */}
                        <div className="lg:col-span-3">
                            {/* Search Bar & Dropdowns */}
                            <div className="flex flex-col gap-6 mb-12">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 shadow-sm flex items-center group focus-within:border-rose-400 transition-all">
                                        <Search className="text-slate-400 ml-2 sm:ml-4 mr-3 sm:mr-4 group-focus-within:text-rose-600 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && setFinalizedSearch(searchTerm)}
                                            placeholder="Search clinics, doctors or services..."
                                            className="w-full bg-transparent border-none focus:outline-none text-slate-800 font-bold text-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setFinalizedSearch(searchTerm)}
                                        className="bg-slate-900 text-white px-8 sm:px-10 py-4 sm:py-0 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                                    >
                                        Search
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-rose-600 transition-colors">
                                            <LayoutGrid size={16} />
                                        </div>
                                        <select
                                            value={subCategory}
                                            onChange={(e) => { setSubCategory(e.target.value); setCurrentPage(1); }}
                                            className="w-full bg-white border border-slate-100 rounded-2xl p-4 pl-14 text-sm font-bold text-slate-600 outline-none focus:border-rose-500/30 shadow-sm appearance-none transition-all cursor-pointer"
                                        >
                                            {uniqueSubCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-rose-600 transition-colors">
                                            <MapPin size={16} />
                                        </div>
                                        <select
                                            value={district}
                                            onChange={(e) => { setDistrict(e.target.value); setAssembly('All Assemblies'); setCurrentPage(1); }}
                                            className="w-full bg-white border border-slate-100 rounded-2xl p-4 pl-14 text-sm font-bold text-slate-600 outline-none focus:border-rose-500/30 shadow-sm appearance-none transition-all cursor-pointer"
                                        >
                                            {uniqueDistricts.map(dst => <option key={dst} value={dst}>{dst}</option>)}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-rose-600 transition-colors">
                                            <MapPin size={16} />
                                        </div>
                                        <select
                                            value={assembly}
                                            onChange={(e) => { setAssembly(e.target.value); setCurrentPage(1); }}
                                            className="w-full bg-white border border-slate-100 rounded-2xl p-4 pl-14 text-sm font-bold text-slate-600 outline-none focus:border-rose-500/30 shadow-sm appearance-none transition-all cursor-pointer"
                                            disabled={district === 'All Districts'}
                                        >
                                            {(districtAssemblyMap[district] || ["All Assemblies"]).map(asm => <option key={asm} value={asm}>{asm}</option>)}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Active Category Tag */}
                            <div className="flex flex-wrap gap-3 mb-10">
                                {selectedCategory !== 'All Categories' && (
                                    <div className="flex items-center gap-3 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 transition-all hover:bg-rose-600">
                                        {selectedCategory}
                                        <button onClick={() => handleCategorySelect('All Categories')} className="border-l border-slate-700 pl-3">
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                                {subCategory !== 'All Sub-Categories' && (
                                    <div className="flex items-center gap-3 bg-rose-50 text-rose-600 border border-rose-100 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all hover:bg-rose-100">
                                        Sub: {subCategory}
                                        <button onClick={() => setSubCategory('All Sub-Categories')} className="border-l border-rose-200 pl-3">
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                                {district !== 'All Districts' && (
                                    <div className="flex items-center gap-3 bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all hover:bg-slate-200">
                                        {district}
                                        <button onClick={() => { setDistrict('All Districts'); setAssembly('All Assemblies'); }} className="border-l border-slate-300 pl-3">
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                                {assembly !== 'All Assemblies' && (
                                    <div className="flex items-center gap-3 bg-[#0f172a] text-slate-300 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all hover:text-white">
                                        {assembly}
                                        <button onClick={() => setAssembly('All Assemblies')} className="border-l border-slate-700 pl-3">
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                                    <Loader2 size={40} className="animate-spin text-primary" />
                                    <p className="font-bold uppercase tracking-widest text-[10px]">Filtering local listings...</p>
                                </div>
                            ) : error ? (
                                <div className="p-8 bg-rose-50 rounded-2xl border border-rose-100 text-center">
                                    <AlertCircle size={40} className="mx-auto text-rose-500 mb-4" />
                                    <p className="text-rose-600 font-bold">{error}</p>
                                </div>
                            ) : (
                                <>
                                    {businesses.length > 0 ? (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {businesses.map(biz => (
                                                    <BusinessCard
                                                        key={biz._id || biz.id}
                                                        business={biz}
                                                    />
                                                ))}
                                            </div>

                                            {/* Pagination Controls */}
                                            <div className="mt-20 flex items-center justify-center gap-8">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                    disabled={currentPage === 1}
                                                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:border-rose-500/30 hover:text-rose-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                                                >
                                                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                                    Previous
                                                </button>

                                                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
                                                    Page <span className="text-slate-900 ml-2">{currentPage}</span>
                                                </span>

                                                <button
                                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                                    disabled={businesses.length < 12}
                                                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:border-rose-500/30 hover:text-rose-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                                                >
                                                    Next
                                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No businesses found matching your criteria.</p>
                                            <button
                                                onClick={() => { handleCategorySelect('All Categories'); setSearchTerm(''); }}
                                                className="mt-4 text-rose-600 font-black text-xs uppercase tracking-widest underline decoration-rose-200"
                                            >
                                                Clear all filters
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section >
        </main >
    );
};

export default BusinessList;
