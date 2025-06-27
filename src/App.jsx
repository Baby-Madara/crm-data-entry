import { useState, useEffect, useRef } from "react";
import { createPortal }                from "react-dom";
import { v4 as uuidv4 }                from "uuid";
import { Button }                      from "@/components/ui/button";
import { Input }                       from "@/components/ui/input";
import { Card }                        from "@/components/ui/card";
import { Badge }                       from "@/components/ui/badge";
import { Copy, Edit, Trash2, Eye, Plus, Search, Filter, Download, XCircle, Pencil } from "lucide-react";
import './App.css';


const jobPositions = [
    {job:"Manager",            color:"#F51111"  },
    {job:"Operation Manager",  color:"#F55F5F"  },
    {job:"Sales",              color:"#11B55F"  },
    {job:"Customer Service",   color:"#5F5FF5"  },

];


const employees = [
    { id: "emp1", name: "Ahmed Farahat",    phone: "+201234567890", position: "Customer Service",  employment_date: "2022-01-15", color: "#5F5FF5", rank: 1, title: "Engineer"                      , titleShort: "Eng."    },
    { id: "emp2", name: "Mohamed Ahmed",    phone: "+201112223334", position: "Operation Manager", employment_date: "2021-11-01", color: "#F55F5F", rank: 2, title: "Technical Support Specialist"  , titleShort: "Eng."    },
    { id: "emp3", name: "Ahmed Ashraf",     phone: "+201555666777", position: "Sales",             employment_date: "2023-03-10", color: "#11B55F", rank: 3, title: "Engineer"                      , titleShort: "Eng."    },
    { id: "emp4", name: "Yathreb Hamdi",    phone: "+201888999000", position: "Manager",           employment_date: "2020-07-20", color: "#F51111", rank: 1, title: "Sales Representative"          , titleShort: "Dr."     },
    { id: "emp5", name: "Shrouq Alaa",      phone: "+201333444555", position: "Customer Service",  employment_date: "2022-09-05", color: "#5F5FF5", rank: 2, title: "Doctor"                        , titleShort: "Dr."     },
];

const statusOptions = [
    { value: "New",         label: "New",         color: "#3B82F6", bgColor: "#DBEAFE", textColor: "#1E40AF" },
    { value: "In Progress", label: "In Progress", color: "#F59E0B", bgColor: "#FEF3C7", textColor: "#92400E" },
    { value: "Completed",   label: "Completed",   color: "#10B981", bgColor: "#D1FAE5", textColor: "#065F46" },
    { value: "On Hold",     label: "On Hold",     color: "#8B5CF6", bgColor: "#EDE9FE", textColor: "#5B21B6" },
    { value: "Cancelled",   label: "Cancelled",   color: "#EF4444", bgColor: "#FEE2E2", textColor: "#991B1B" },
];

const paymentMethods = [
    { value: "Cash",           label: "Cash",           color: "#10B981", icon: "💵" },
    { value: "Credit Card",    label: "Credit Card",    color: "#3B82F6", icon: "💳" },
    { value: "Bank Transfer",  label: "Bank Transfer",  color: "#8B5CF6", icon: "🏦" },
    { value: "PayPal",         label: "PayPal",         color: "#F59E0B", icon: "📱"  },
    { value: "Check",          label: "Check",          color: "#EF4444", icon: "📄" },
];

const countries = [
    "Saudi Arabia", "Egypt", "UAE", "Jordan", "Lebanon", "Kuwait", "Qatar", "Bahrain", "Oman", "Morocco", "Algeria", "Tunisia", "Libya", "Sudan", "Palestine", "Syria", "Iraq", "Yemen", "Comoros", "Mauritania",
    "United States", "United Kingdom", "France", "Germany", "India", "China", "Japan", "Brazil", "Canada", "Australia", "Russia", "Italy", "Spain", "Turkey", "South Africa", "Mexico", "Indonesia", "Pakistan", "Bangladesh", "Nigeria", "Argentina", "Philippines", "Vietnam", "Thailand", "Malaysia", "Singapore", "South Korea", "Sweden", "Norway", "Finland", "Denmark", "Netherlands", "Belgium", "Switzerland", "Austria", "Greece", "Portugal", "Poland", "Czech Republic", "Hungary", "Romania", "Bulgaria", "Slovakia", "Slovenia", "Croatia", "Serbia", "Ukraine", "Belarus", "Estonia", "Latvia", "Lithuania", "Georgia", "Armenia", "Azerbaijan", "Kazakhstan", "Uzbekistan", "Turkmenistan", "Kyrgyzstan", "Tajikistan", "Afghanistan", "Nepal", "Sri Lanka", "Maldives", "Bhutan", "Mongolia", "Cambodia", "Laos", "Myanmar", "New Zealand", "Chile", "Colombia", "Peru", "Venezuela", "Ecuador", "Bolivia", "Paraguay", "Uruguay", "Costa Rica", "Panama", "Guatemala", "Honduras", "El Salvador", "Nicaragua", "Cuba", "Dominican Republic", "Haiti", "Jamaica", "Trinidad and Tobago", "Barbados", "Bahamas", "Iceland", "Ireland", "Luxembourg", "Liechtenstein", "Monaco", "San Marino", "Andorra", "Malta", "Cyprus", "Israel", "Iran", "North Korea", "Macedonia", "Montenegro", "Bosnia and Herzegovina", "Albania", "Moldova", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Madagascar", "Malawi", "Mali", "Mauritius", "Mozambique", "Namibia", "Niger", "Rwanda", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Sudan", "Swaziland", "Tanzania", "Togo", "Uganda", "Zambia", "Zimbabwe"
];
const arabCountries = ["Saudi Arabia", "Egypt", "UAE", "Jordan", "Lebanon", "Kuwait", "Qatar", "Bahrain", "Oman", "Morocco", "Algeria", "Tunisia", "Libya", "Sudan", "Palestine", "Syria", "Iraq", "Yemen", "Comoros", "Mauritania"];
const countryColors = {
    'Saudi Arabia':  '#A7F3D0',
    'Egypt':         '#FDE68A',
    'UAE':           '#BFDBFE',
    'Jordan':        '#FCA5A5',
    'Lebanon':       '#DDD6FE',
    'Kuwait':        '#FBCFE8',
    'Qatar':         '#FDE68A',
    'Bahrain':       '#FDE68A',
    'Oman':          '#FDE68A',
    'Morocco':       '#FDE68A',
    'Algeria':       '#FDE68A',
    'Tunisia':       '#FDE68A',
    'Libya':         '#FDE68A',
    'Sudan':         '#FDE68A',
    'Palestine':     '#FDE68A',
    'Syria':         '#FDE68A',
    'Iraq':          '#FDE68A',
    'Yemen':         '#FDE68A',
    'Comoros':       '#FDE68A',
    'Mauritania':    '#FDE68A',
};

// 1. Add a unique color for the add-row
const ADD_ROW_COLOR = '#e0e7ef';

// PortalDropdown: renders children in a portal, positioned relative to a target element
function PortalDropdown({ anchorRef, open, onClose, children, width = 220 }) {
    const [pos, setPos] = useState(null);
    const menuRef = useRef();
    useEffect(() => {
        if (open && anchorRef?.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            const isMobile = window.innerWidth < 640;
            setPos(isMobile ? {
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                mobile: true
            } : {
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width > 220 ? rect.width : 220,
                mobile: false
            });
        }
    }, [open, anchorRef, width]);
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (
                anchorRef?.current && !anchorRef.current.contains(e.target) &&
                menuRef.current && !menuRef.current.contains(e.target)
            ) {
                onClose?.();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, anchorRef, onClose]);
    if (!open || !pos) return null;
    if (pos.mobile) {
        // Mobile: wide (90vw or min 320px), not full screen, not covering the whole window
        // Position below button, centered if possible, no overlay
        const vw = Math.max(window.innerWidth, document.documentElement.clientWidth);
        const dropdownWidth = Math.max(Math.min(0.9 * vw, 400), 320); // 90vw, min 320px, max 400px
        let left = pos.left;
        // Center if dropdown would overflow right edge
        if (left + dropdownWidth > vw) {
            left = vw - dropdownWidth - 8; // 8px margin from edge
        }
        if (left < 8) left = 8;
        return createPortal(
            <div
                ref={menuRef}
                style={{
                    position: "absolute",
                    top: pos.top,
                    left,
                    minWidth: dropdownWidth,
                    width: dropdownWidth,
                    zIndex: 1050,
                    maxWidth: '98vw',
                    borderRadius: '0.75rem',
                    boxShadow: '0 8px 32px 0 rgba(31, 41, 55, 0.18)',
                    padding: '0.25rem',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                }}
                className="filter-dropdown-mobile-ui"
            >
                {children}
            </div>,
            document.body
        );
    }
    // Desktop: wide, rounded, shadowed
    return createPortal(
        <div
            ref={menuRef}
            style={{
                position: "absolute",
                top: pos.top,
                left: pos.left,
                minWidth: pos.width,
                width: pos.width,
                zIndex: 1050,
                maxWidth: 400,
                maxHeight: '60vh',
                overflowY: 'auto',
                boxShadow: '0 8px 32px 0 rgba(31, 41, 55, 0.18)',
                borderRadius: '1rem',
                padding: '0.5rem',
                background: 'white',
                border: '1px solid #e5e7eb',
            }}
            className="filter-dropdown-desktop-ui"
        >
            {children}
        </div>,
        document.body
    );
}

// Helper to get local datetime string for input[type="datetime-local"]
function getLocalDateTimeString(date = new Date()) {
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}


// row: [action | eventNum | ClientName | phoneNum | address | city | country | mapsLocation | status | orderNum | order | orderVal | paymentType | deliveryRepresentative | CRMAgent | startTime | deliveryTime | delivered | chatLink | crmAgentNotes | deliveryRepNotes | customerNotes ]

const initialEventRow = {
    eventNum: null,
    clientName: "",
    phoneNum: "",
    address: "",
    city: "",
    country: "Saudi Arabia",
    mapsLocation: "",
    status: "New",
    orderNum: "",
    order: "",
    orderVal: "",
    paymentType: "",
    deliveryRepresentative: "",
    crmAgents: [],
    startTime: getLocalDateTimeString(),
    deliveryTime: "",
    delivered: false,
    chatLink: "",
    crmAgentNotes: "",
    deliveryRepNotes: "",
    customerNotes: ""
};

function InstallPWAButton() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);
    if (!deferredPrompt) return null;
    return (
        <button
            onClick={() => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
            }}
            className="ml-2 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
            Install App
        </button>
    );
}

// Replace AgentCell with this version above the main App function:
function AgentCell({ value, onChange, dropdownOpen, onEdit, onDropdownClose, agents }) {
    const buttonRef = useRef();
    const empData = name => employees.find(e => e.name === name);
    return (
        <div className="relative flex items-center">
            <div className="max-w-[110px] overflow-x-auto whitespace-nowrap flex gap-1 items-center">
                {value.length === 0 ? (
                    <span className="text-gray-400 text-xs">Select agent(s)</span>
                ) : (
                    value.map(agentName => {
                        const emp = empData(agentName);
                        return (
                            <span key={agentName} className="inline-flex items-center gap-1 px-1 py-0.5 rounded text-xs" style={{ backgroundColor: emp?.color + '20', color: emp?.color, border: `1px solid ${emp?.color}40` }}>
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: emp?.color }}></div>
                                {agentName}
                            </span>
                        );
                    })
                )}
            </div>
            <button
                type="button"
                ref={buttonRef}
                className="ml-1 p-0.5 rounded hover:bg-gray-100 focus:bg-gray-200"
                onClick={onEdit}
                tabIndex={0}
                aria-label="Edit agents"
            >
                <Pencil className="w-3 h-3 text-gray-500" />
            </button>
            {dropdownOpen && (
                <PortalDropdown anchorRef={buttonRef} open={dropdownOpen} onClose={onDropdownClose} width={180}>
                    <div className="z-30 bg-white border rounded-xl shadow-lg w-full max-h-40 overflow-y-auto mt-1 text-xs">
                        {agents.map(opt => {
                            const emp = employees.find(e => e.name === opt);
                            return (
                                <label key={opt} className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-50 focus-within:bg-blue-100 rounded-lg transition-colors whitespace-normal break-words max-w-full border-b border-gray-100 last:border-b-0">
                                    <input
                                        type="checkbox"
                                        checked={value.includes(opt)}
                                        onChange={() => {
                                            if (value.includes(opt)) {
                                                onChange(value.filter(a => a !== opt));
                                            } else {
                                                onChange([...value, opt]);
                                            }
                                        }}
                                        className="mr-2 accent-blue-500 w-4 h-4"
                                    />
                                    <div className="flex items-center gap-2">
                                        {emp?.color && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: emp?.color }}></div>}
                                        <span>{opt}</span>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </PortalDropdown>
            )}
        </div>
    );
}

export default function App() {
    const [items,             setItems             ] = useState([]);
    const [filter,            setFilter            ] = useState("");
    const [statusFilter,      setStatusFilter      ] = useState("");
    const [selectedCustomer,  setSelectedCustomer  ] = useState(null);
    const [newRow,            setNewRow            ] = useState({ ...initialEventRow });

    const agents = employees.map((e) => e.name);

    // Add column widths state for resizable columns
    const defaultWidths = {
        actions: 90,
        eventNum: 60,
        clientName: 140,
        phoneNum: 120,
        address: 140,
        city: 90,
        country: 100,
        mapsLocation: 120,
        status: 90,
        orderNum: 110,
        order: 110,
        orderVal: 90,
        paymentType: 100,
        deliveryRepresentative: 130,
        crmAgents: 140,
        startTime: 120,
        deliveryTime: 120,
        delivered: 80,
        chatLink: 90,
        crmAgentNotes: 120,
        deliveryRepNotes: 120,
        customerNotes: 120
    };
    const [colWidths, setColWidths] = useState(defaultWidths);
    const resizingCol = useRef(null);
    const startX = useRef(0);
    const startWidth = useRef(0);

    // Table height resizing state
    const [tableHeight, setTableHeight] = useState(400);
    const resizingHeight = useRef(false);
    const startY = useRef(0);
    const startHeight = useRef(0);

    // Vertical resize handlers
    const handleHeightResizeStart = (e) => {
        e.preventDefault();
        resizingHeight.current = true;
        startY.current = e.clientY;
        startHeight.current = tableHeight;
        document.addEventListener('mousemove', handleHeightResizing);
        document.addEventListener('mouseup', handleHeightResizeEnd);
    };

    const handleHeightResizing = (e) => {
        if (!resizingHeight.current) return;
        const diff = e.clientY - startY.current;
        setTableHeight(Math.max(200, startHeight.current + diff));
    };

    const handleHeightResizeEnd = () => {
        resizingHeight.current = false;
        document.removeEventListener('mousemove', handleHeightResizing);
        document.removeEventListener('mouseup', handleHeightResizeEnd);
    };

    // Sorting state
    const [sortConfig, setSortConfig] = useState({ key: 'eventNum', direction: 'desc' });
    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };
    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? '▲' : '▼';
    };
    // Sort items
    const sortedItems = [...items].sort((a, b) => {
        const { key, direction } = sortConfig;
        let aVal = a[key], bVal = b[key];
        if (key === 'orderVal') {
            aVal = parseFloat(aVal) || 0;
            bVal = parseFloat(bVal) || 0;
        }
        if (aVal === undefined) return 1;
        if (bVal === undefined) return -1;
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Filtering state
    const [agentFilter, setAgentFilter] = useState([]);
    const [statusMultiFilter, setStatusMultiFilter] = useState([]);
    const [paymentFilter, setPaymentFilter] = useState([]);
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    // Move useRef and focusCell here
    const inputRefs = useRef({});
    const focusCell = (rowKey, colKey) => {
        const ref = inputRefs.current[`${rowKey}-${colKey}`];
        if (ref) ref.focus();
    };

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("crmData")) || [];
        setItems(saved);
    }, []);

    useEffect(() => {
        localStorage.setItem("crmData", JSON.stringify(items));
    }, [items]);

    // Assign eventNum sequentially, descending
    const getNextEventNum = () => {
        if (items.length === 0) return 1;
        return Math.max(...items.map(i => i.eventNum || 0)) + 1;
    };

    const addItem = () => {
        if (!newRow.clientName.trim()) return;
        const newItem = { id: uuidv4(), ...newRow, eventNum: getNextEventNum() };
        setItems([newItem, ...items]);
        setNewRow({ ...initialEventRow });
    };

    const resetNewRow = () => {
        setNewRow({ ...initialEventRow });
    };

    const editItem = (id, field, value) => {
        setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    };

    const deleteItem = (id) => {
        if (confirm("Are you sure you want to delete this customer?")) {
            setItems(items.filter((item) => item.id !== id));
        }
    };

    const handlePhoneChange = (val) => {
        const filtered = val.replace(/[^\d+, ]/g, "");
        setNewRow({ ...newRow, phoneNum: filtered });
    };

    // Handler for editing phone in existing rows
    const handleEditPhoneChange = (id, val) => {
        const filtered = val.replace(/[^\d+, ]/g, "");
        editItem(id, 'phoneNum', filtered);
    };

    const toggleCrmAgent = (agent) => {
        setNewRow({
            ...newRow,
            crmAgents: newRow.crmAgents.includes(agent)
                ? newRow.crmAgents.filter((a) => a !== agent)
                : [...newRow.crmAgents, agent]
        });
    };

    const filteredItems = items.filter((item) => {
        const matchesSearch = item.clientName.toLowerCase().includes(filter.toLowerCase()) ||
                            item.phoneNum.includes(filter) ||
                            item.mapsLocation.toLowerCase().includes(filter.toLowerCase()) ||
                            item.city.toLowerCase().includes(filter.toLowerCase()) ||
                            item.orderNum.toLowerCase().includes(filter.toLowerCase());
        
        const matchesStatus = !statusFilter || item.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const exportData = () => {
        const dataStr = JSON.stringify(items, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'crm-data.json';
        link.click();
    };

    const getStatusColor = (status) => {
        const statusData = statusOptions.find(s => s.value === status);
        if (statusData) {
            return `bg-[${statusData.bgColor}] text-[${statusData.textColor}]`;
        }
        return "bg-gray-100 text-gray-800";
    };

    const getStatusData = (status) => {
        return statusOptions.find(s => s.value === status) || statusOptions[0];
    };

    const getEmployeeData = (name) => {
        return employees.find(emp => emp.name === name);
    };

    const getPaymentData = (method) => {
        return paymentMethods.find(p => p.value === method);
    };

    const handleResizeStart = (col, e) => {
        if (typeof window !== 'undefined' && window.innerWidth < 640) return;
        e.stopPropagation();
        resizingCol.current = col;
        startX.current = e.clientX;
        startWidth.current = colWidths[col];
        document.addEventListener('mousemove', handleResizing);
        document.addEventListener('mouseup', handleResizeEnd);
    };
    const handleResizing = (e) => {
        if (!resizingCol.current) return;
        const diff = e.clientX - startX.current;
        setColWidths((prev) => ({ ...prev, [resizingCol.current]: Math.max(60, startWidth.current + diff) }));
    };
    const handleResizeEnd = () => {
        resizingCol.current = null;
        document.removeEventListener('mousemove', handleResizing);
        document.removeEventListener('mouseup', handleResizeEnd);
    };

    // Column order state
    const [columnOrder, setColumnOrder] = useState([
        'actions', 'eventNum', 'clientName', 'phoneNum', 'address', 'city', 'country', 'mapsLocation',
        'status', 'orderNum', 'order', 'orderVal', 'paymentType', 'deliveryRepresentative', 'crmAgents',
        'startTime', 'deliveryTime', 'delivered', 'chatLink', 'crmAgentNotes', 'deliveryRepNotes', 'customerNotes'
    ]);

    // Drag and drop state
    const [draggedColumn, setDraggedColumn] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);

    // Column drag and drop handlers
    const handleDragStart = (e, column) => {
        setDraggedColumn(column);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, column) => {
        e.preventDefault();
        if (draggedColumn && draggedColumn !== column) {
            setDragOverColumn(column);
        }
    };

    const handleDrop = (e, targetColumn) => {
        e.preventDefault();
        if (draggedColumn && draggedColumn !== targetColumn) {
            const newOrder = [...columnOrder];
            const draggedIndex = newOrder.indexOf(draggedColumn);
            const targetIndex = newOrder.indexOf(targetColumn);
            
            newOrder.splice(draggedIndex, 1);
            newOrder.splice(targetIndex, 0, draggedColumn);
            
            setColumnOrder(newOrder);
        }
        setDraggedColumn(null);
        setDragOverColumn(null);
    };

    const handleDragEnd = () => {
        setDraggedColumn(null);
        setDragOverColumn(null);
    };

    // Column header component
    const ColumnHeader = ({ column, children }) => {
        const isDragging = draggedColumn === column;
        const isDragOver = dragOverColumn === column;
        
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    return (
            <th 
                style={{width: colWidths[column]}} 
                className={`px-1 py-0.5 text-[11px] font-medium text-gray-700 uppercase tracking-wider border-r border-gray-400 bg-gray-100 relative cursor-move ${
                    isDragging ? 'opacity-50' : ''
                } ${isDragOver ? 'border-l-2 border-blue-500' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, column)}
                onDragOver={(e) => handleDragOver(e, column)}
                onDrop={(e) => handleDrop(e, column)}
                onDragEnd={handleDragEnd}
            >
                <div className="flex items-center justify-between">
                    <span onClick={() => handleSort(column === 'eventNum' ? 'eventNum' : column)} className="cursor-pointer">
                        {
                            column === 'eventNum' ? '#' :
                            column === 'actions' ? 'Actions' :
                            column === 'clientName' ? 'Client' :
                            column === 'phoneNum' ? 'Phone' :
                            column === 'city' ? 'City' :
                            column === 'country' ? 'Country' :
                            column === 'mapsLocation' ? 'Maps' :
                            column === 'status' ? 'Status' :
                            column === 'orderNum' ? 'Order #' :
                            column === 'order' ? 'Order' :
                            column === 'orderVal' ? 'Value' :
                            column === 'paymentType' ? 'Payment' :
                            column === 'deliveryRepresentative' ? 'Del. Rep.' :
                            column === 'crmAgents' ? 'CRM Agents' :
                            column === 'startTime' ? 'Start' :
                            column === 'deliveryTime' ? 'Delivery Time' :
                            column === 'delivered' ? 'Delivered' :
                            column === 'chatLink' ? 'Chat Link' :
                            column === 'crmAgentNotes' ? 'CRM Notes' :
                            column === 'deliveryRepNotes' ? 'Delivery Rep. Notes' :
                            column === 'customerNotes' ? 'Customer Notes' :
                            column
                        }
                    </span>
                    <div className="flex items-center gap-1">
                        <span className="text-gray-400 cursor-move select-none">⋮⋮</span>
                        <span onClick={() => handleSort(column === 'eventNum' ? 'eventNum' : column)} className="cursor-pointer">
                            {getSortIndicator(column === 'eventNum' ? 'eventNum' : column)}
                        </span>
                    </div>
                </div>
                <span 
                    className={isMobile ? 'hidden' : 'absolute right-0 top-0 h-full w-1.5 cursor-col-resize bg-gray-300'}
                    onMouseDown={isMobile ? undefined : (e) => handleResizeStart(column, e)}
                />
            </th>
        );
    };

    // Filtering logic
    const filteredSortedItems = sortedItems.filter((item) => {
        const matchesSearch = item.clientName.toLowerCase().includes(filter.toLowerCase()) ||
            item.phoneNum.includes(filter) ||
            (item.mapsLocation || '').toLowerCase().includes(filter.toLowerCase()) ||
            (item.city || '').toLowerCase().includes(filter.toLowerCase()) ||
            (item.orderNum || '').toLowerCase().includes(filter.toLowerCase());
        const matchesStatus = statusMultiFilter.length === 0 || statusMultiFilter.includes(item.status);
        const matchesAgent = agentFilter.length === 0 || item.crmAgents.some(a => agentFilter.includes(a));
        const matchesPayment = paymentFilter.length === 0 || paymentFilter.includes(item.paymentType);
        const matchesDate = (!dateRange.from || (item.startTime && item.startTime >= dateRange.from)) &&
                            (!dateRange.to || (item.startTime && item.startTime <= dateRange.to));
        return matchesSearch && matchesStatus && matchesAgent && matchesPayment && matchesDate;
    });

    // Generic MultiSelectDropdown component, similar to AgentsDropdown for status and payment
    function MultiSelectDropdown({ value, onChange, options, getOptionData, placeholder }) {
        const [open, setOpen] = useState(false);
        const btnRef = useRef();
        const toggle = () => setOpen((v) => !v);
        const handleOption = (opt) => {
            if (value.includes(opt)) {
                onChange(value.filter((a) => a !== opt));
            } else {
                onChange([...value, opt]);
            }
        };
        return (
            <div className="relative">
                <button type="button" ref={btnRef} className="w-full border rounded bg-white text-left px-3 py-1 text-sm h-9 flex items-center min-w-fit" onClick={toggle}>
                    {value.length === 0 ? placeholder : (
                        <div className="flex flex-wrap gap-1">
                            {value.map(opt => {
                                const data = getOptionData(opt);
                                return (
                                    <span key={opt} className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs" style={data?.color ? { backgroundColor: data?.bgColor || data?.color + '20', color: data?.textColor || data?.color, border: data?.color ? `1px solid ${data?.color}40` : undefined } : {}}>
                                        {data?.icon && <span className="text-sm">{data.icon}</span>}
                                        {data?.label || opt}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </button>
                <PortalDropdown anchorRef={btnRef} open={open} onClose={() => setOpen(false)} width={140}>
                    <div className="z-30 bg-white border rounded-xl shadow-lg w-full max-h-40 overflow-y-auto mt-1 text-xs">
                        {options.map(opt => {
                            const data = getOptionData(opt);
                            return (
                                <label key={opt} className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-50 focus-within:bg-blue-100 rounded-lg transition-colors whitespace-normal break-words max-w-full border-b border-gray-100 last:border-b-0">
                                    <input
                                        type="checkbox"
                                        checked={value.includes(opt)}
                                        onChange={() => handleOption(opt)}
                                        className="mr-2 accent-blue-500 w-4 h-4"
                                    />
                                    <div className="flex items-center gap-2">
                                        {data?.color && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data?.color }}></div>}
                                        {data?.icon && <span className="text-sm">{data.icon}</span>}
                                        <span>{data?.label || opt}</span>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </PortalDropdown>
            </div>
        );
    }

    const handleOrderValChange = (val) => {
        // Allow only numbers, comma, dot, apostrophe
        const filtered = val.replace(/[^0-9,.'']/g, '');
        setNewRow({ ...newRow, orderVal: filtered });
    };
    const handleEditOrderValChange = (id, val) => {
        const filtered = val.replace(/[^0-9,.'']/g, '');
        editItem(id, 'orderVal', filtered);
    };

    // At the top level of App component:
    const [editingAgentsRow, setEditingAgentsRow] = useState(null); // null, 'new', or row id
    const [popoverPos, setPopoverPos] = useState(null);
    const pencilRefs = useRef({});

    return (
        <div className="min-h-screen bg-gray-50 p-2">
            <div className="max-w-full mx-auto space-y-3">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">CRM Data Entry System</h1>
                            <p className="text-gray-600 mt-0.5 text-xs">Manage customer relationships and orders</p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={exportData} variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                            <InstallPWAButton />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-1">
                    <div className="flex flex-row gap-2 items-center justify-between w-full overflow-x-auto pb-1 px-1">
                        {[{
                            label: 'Customers',
                            value: filteredSortedItems.length,
                            color: 'text-blue-600'
                        }, {
                            label: 'Completed',
                            value: filteredSortedItems.filter(item => item.status === "Completed").length,
                            color: 'text-green-600'
                        }, {
                            label: 'In Progress',
                            value: filteredSortedItems.filter(item => item.status === "In Progress").length,
                            color: 'text-yellow-600'
                        }, {
                            label: 'Total Value',
                            value: `${filteredSortedItems.reduce((sum, item) => sum + (parseFloat(item.orderVal) || 0), 0).toFixed(2)} SAR`,
                            color: 'text-purple-600'
                        }].map(stat => (
                            <div key={stat.label} className="flex flex-col items-center bg-white rounded-lg shadow border border-gray-200 px-3 py-1 min-w-[80px] max-w-[100px]">
                                <div className={`text-base font-bold leading-none ${stat.color}`}>{stat.value}</div>
                                <div className="text-[10px] text-gray-500 leading-none mt-0.5">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-2">
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="relative w-full max-w-[180px]">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                                <Input 
                                    placeholder="Search..." 
                                    value={filter} 
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="pl-7 py-0.5 text-xs h-8 w-full min-w-[120px]"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="px-2 py-1 h-8 text-xs flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => {
                                    setFilter("");
                                    setStatusMultiFilter([]);
                                    setPaymentFilter([]);
                                    setAgentFilter([]);
                                    setDateRange({ from: '', to: '' });
                                }}
                                title="Clear all filters"
                            >
                                <XCircle className="w-4 h-4 mr-1" />
                                Clear
                            </Button>
                        </div>
                        <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-1 px-1" style={{ WebkitOverflowScrolling: 'touch' }}>
                            <div className="min-w-fit w-auto">
                                <MultiSelectDropdown
                                    value={statusMultiFilter}
                                    onChange={setStatusMultiFilter}
                                    options={statusOptions.map(s => s.value)}
                                    getOptionData={opt => statusOptions.find(s => s.value === opt)}
                                    placeholder="Status"
                                />
                            </div>
                            <div className="min-w-fit w-auto">
                                <MultiSelectDropdown
                                    value={paymentFilter}
                                    onChange={setPaymentFilter}
                                    options={paymentMethods.map(p => p.value)}
                                    getOptionData={opt => paymentMethods.find(p => p.value === opt)}
                                    placeholder="Payment"
                                />
                            </div>
                            <div className="min-w-fit w-auto">
                                <MultiSelectDropdown
                                    value={agentFilter}
                                    onChange={setAgentFilter}
                                    options={agents}
                                    getOptionData={opt => getEmployeeData(opt)}
                                    placeholder="Select agent(s)"
                                />
                            </div>
                            <div className="flex gap-1 items-center text-xs min-w-[220px]">
                                <span>From</span>
                                <input type="datetime-local" value={dateRange.from} onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))} className="border rounded px-1 py-0.5 h-7 text-xs" />
                                <span>To</span>
                                <input type="datetime-local" value={dateRange.to} onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))} className="border rounded px-1 py-0.5 h-7 text-xs" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table with Horizontal Scroll */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="overflow-x-auto" style={{ height: tableHeight }}>
                        <div className="min-w-[2200px]">
                            <table className="w-full min-w-[2200px] text-xs border border-gray-400" style={{ tableLayout: 'fixed' }}>
                                <thead className="bg-gray-50 sticky top-0 z-10 border-b-2 border-gray-400">
                                    <tr className="border-b border-gray-400">
                                        {columnOrder.map(column => (
                                            <ColumnHeader key={column} column={column}>
                                                {
                                                    column === 'eventNum' ? '#' :
                                                    column === 'actions' ? 'Actions' :
                                                    column === 'clientName' ? 'Client' :
                                                    column === 'phoneNum' ? 'Phone' :
                                                    column === 'city' ? 'City' :
                                                    column === 'country' ? 'Country' :
                                                    column === 'mapsLocation' ? 'Maps' :
                                                    column === 'status' ? 'Status' :
                                                    column === 'orderNum' ? 'Order #' :
                                                    column === 'order' ? 'Order' :
                                                    column === 'orderVal' ? 'Value' :
                                                    column === 'paymentType' ? 'Payment' :
                                                    column === 'deliveryRepresentative' ? 'Del. Rep.' :
                                                    column === 'crmAgents' ? 'CRM Agents' :
                                                    column === 'startTime' ? 'Start' :
                                                    column === 'deliveryTime' ? 'Delivery Time' :
                                                    column === 'delivered' ? 'Delivered' :
                                                    column === 'chatLink' ? 'Chat Link' :
                                                    column === 'crmAgentNotes' ? 'CRM Notes' :
                                                    column === 'deliveryRepNotes' ? 'Delivery Rep. Notes' :
                                                    column === 'customerNotes' ? 'Customer Notes' :
                                                    column
                                                }
                                            </ColumnHeader>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-300">
                                    {/* Empty row for new entry */}
                                    <tr className="border-b-2 border-gray-400" style={{ backgroundColor: ADD_ROW_COLOR }}>
                                        {columnOrder.map((column, colIdx) => {
                                            const fieldMap = {
                                                eventNum: 'eventNum',
                                                clientName: 'clientName',
                                                phoneNum: 'phoneNum',
                                                city: 'city',
                                                country: 'country',
                                                mapsLocation: 'mapsLocation',
                                                orderNum: 'orderNum',
                                                order: 'order',
                                                orderVal: 'orderVal',
                                                paymentType: 'paymentType',
                                                deliveryRepresentative: 'deliveryRepresentative',
                                                delivered: 'delivered',
                                            };
                                            const field = fieldMap[column] || column;
                                            let cell = null;
                                            if (column === 'eventNum') {
                                                cell = <span />;
                                            } else if ([
                                                'clientName','phoneNum','city','country','mapsLocation','orderNum','order','orderVal','deliveryRepresentative','delivered'
                                            ].includes(column)) {
                                                if (column === 'phoneNum') {
                                                    cell = (
                                                        <Input
                                                            ref={el => inputRefs.current[`new-${column}`] = el}
                                                            value={newRow.phoneNum || ''}
                                                            onChange={e => handlePhoneChange(e.target.value)}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Escape') e.target.blur();
                                                                if (e.key === 'ArrowDown') focusCell(0, column);
                                                                if (e.key === 'Enter' && newRow.clientName.trim()) {
                                                                    addItem();
                                                                    setTimeout(() => focusCell('new', 'clientName'), 0);
                                                                }
                                                            }}
                                                            className="py-0 px-1 h-5 text-[11px]"
                                                        />
                                                    );
                                                } else {
                                                    cell = (
                                                        <Input
                                                            ref={el => inputRefs.current[`new-${column}`] = el}
                                                            value={newRow[field] || ''}
                                                            onChange={e => setNewRow({ ...newRow, [field]: e.target.value })}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Escape') e.target.blur();
                                                                if (e.key === 'ArrowDown') focusCell(0, column);
                                                                if (e.key === 'Enter' && newRow.clientName.trim()) {
                                                                    addItem();
                                                                    setTimeout(() => focusCell('new', 'clientName'), 0);
                                                                }
                                                            }}
                                                            className="py-0 px-1 h-5 text-[11px]"
                                                        />
                                                    );
                                                }
                                            } else if (column === 'country') {
                                                cell = (
                                <select 
                                                        ref={el => inputRefs.current[`new-${column}`] = el}
                                    value={newRow.country} 
                                                        onChange={e => setNewRow({ ...newRow, country: e.target.value })}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Escape') e.target.blur();
                                                            if (e.key === 'ArrowDown') focusCell(0, column);
                                                            if (e.key === 'Enter' && newRow.clientName.trim()) {
                                                                addItem();
                                                                setTimeout(() => focusCell('new', 'clientName'), 0);
                                                            }
                                                        }}
                                                        className="w-full px-1 py-0 h-5 text-[11px] border rounded"
                                >
                                    <option value="">Select country</option>
                                    {countries.map(country => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                                                );
                                            } else if (column === 'status') {
                                                cell = (
                                                    <select
                                                        ref={el => inputRefs.current[`new-${column}`] = el}
                                                        value={newRow.status}
                                                        onChange={e => setNewRow({ ...newRow, status: e.target.value })}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Escape') e.target.blur();
                                                            if (e.key === 'ArrowDown') focusCell(0, column);
                                                            if (e.key === 'Enter' && newRow.clientName.trim()) {
                                                                addItem();
                                                                setTimeout(() => focusCell('new', 'clientName'), 0);
                                                            }
                                                        }}
                                                        className="w-full px-1 py-0 h-5 text-[11px] border rounded"
                                                    >
                                                        {statusOptions.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                );
                                            } else if (column === 'crmAgents') {
                                                // look carefuully at this
                                                cell = (
                                                    <AgentCell
                                                        value={newRow.crmAgents}
                                                        onChange={agents => setNewRow({ ...newRow, crmAgents: agents })}
                                                        isEditing={editingAgentsRow === 'new'}
                                                        onEdit={() => setEditingAgentsRow('new')}
                                                        dropdownOpen={editingAgentsRow === 'new'}
                                                        onDropdownClose={() => setEditingAgentsRow(null)}
                                                        agents={agents}
                                                    />
                                                );
                                            } else if (column === 'paymentType') {
                                                const paymentData = getPaymentData(newRow.paymentType);
                                                cell = (
                                                    <div className="flex items-center gap-1">
                                <select 
                                                            ref={el => inputRefs.current[`new-${column}`] = el}
                                                            value={newRow.paymentType}
                                                            onChange={e => setNewRow({ ...newRow, paymentType: e.target.value })}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Escape') e.target.blur();
                                                                if (e.key === 'ArrowDown') focusCell(0, column);
                                                                if (e.key === 'Enter' && newRow.clientName.trim()) {
                                                                    addItem();
                                                                    setTimeout(() => focusCell('new', 'clientName'), 0);
                                                                }
                                                            }}
                                                            className="w-full px-1 py-0 h-5 text-[11px] border rounded"
                                                            style={paymentData ? { backgroundColor: paymentData.color + '20', color: paymentData.color, border: `1px solid ${paymentData.color}40` } : {}}
                                                        >
                                                            <option value="">Select payment</option>
                                                            {paymentMethods.map(opt => (
                                                                <option key={opt.value} value={opt.value}>
                                                                    {opt.icon} {opt.label}
                                                                </option>
                                    ))}
                                </select>
                            </div>
                                                );
                                            } else if (column === 'delivered') {
                                                cell = (
                                                    <input
                                                        type="checkbox"
                                                        checked={!!newRow.delivered}
                                                        onChange={e => setNewRow({ ...newRow, delivered: e.target.checked })}
                                                        className="h-4 w-4"
                                                    />
                                                );
                                            } else if (column === 'startTime' || column === 'deliveryTime') {
                                                cell = (
                                                    <input
                                                        type="datetime-local"
                                                        ref={el => inputRefs.current[`new-${column}`] = el}
                                                        value={newRow[column] || ''}
                                                        onChange={e => setNewRow({ ...newRow, [column]: e.target.value })}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Escape') e.target.blur();
                                                            if (e.key === 'ArrowDown') focusCell(0, column);
                                                            if (e.key === 'Enter' && newRow.clientName.trim()) {
                                                                addItem();
                                                                setTimeout(() => focusCell('new', 'clientName'), 0);
                                                            }
                                                        }}
                                                        className="w-full px-1 py-0.5 h-7 text-xs border rounded"
                                                    />
                                                );
                                            } else if (column === 'actions') {
                                                cell = (
                                                    <Button size="sm" variant="outline" className="h-6 px-1 text-xs ml-1" onClick={addItem} disabled={!newRow.clientName.trim()}>
                                                        <Plus className="w-3 h-3 mr-1" /> Add
                                                    </Button>
                                                );
                                            } else if ([
                                                        'address', 'chatLink'
                                                    ].includes(column)) {
                                                        cell = (
                                <Input 
                                                                type={column === 'chatLink' ? 'url' : 'text'}
                                                                ref={el => inputRefs.current[`new-${column}`] = el}
                                                                value={newRow[field] || ''}
                                                                onChange={e => setNewRow({ ...newRow, [field]: e.target.value })}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Escape') e.target.blur();
                                                                    if (e.key === 'ArrowDown') focusCell(0, column);
                                                                    if (e.key === 'Enter' && newRow.clientName.trim()) {
                                                                        addItem();
                                                                        setTimeout(() => focusCell('new', 'clientName'), 0);
                                                                    }
                                                                }}
                                                                className="py-0 px-1 h-5 text-[11px]"
                                                            />
                                                        );
                                                    } else if ([
                                                        'crmAgentNotes', 'deliveryRepNotes', 'customerNotes'
                                                    ].includes(column)) {
                                                        cell = (
                                                            <textarea
                                                                ref={el => inputRefs.current[`new-${column}`] = el}
                                                                value={newRow[field] || ''}
                                                                onChange={e => setNewRow({ ...newRow, [field]: e.target.value })}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Escape') e.target.blur();
                                                                    if (e.key === 'ArrowDown') focusCell(0, column);
                                                                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && newRow.clientName.trim()) {
                                                                        addItem();
                                                                        setTimeout(() => focusCell('new', 'clientName'), 0);
                                                                    }
                                                                }}
                                                                className="py-0 px-1 h-5 text-[11px] w-full resize-vertical border rounded"
                                                                rows={1}
                                                            />
                                                        );
                                                    } else if (column === 'orderVal') {
                                                        cell = (
                                <Input 
                                                                ref={el => inputRefs.current[`new-orderVal`] = el}
                                                                value={newRow.orderVal || ''}
                                                                onChange={e => handleOrderValChange(e.target.value)}
                                                                inputMode="decimal"
                                                                pattern="[0-9,.'']*"
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Escape') e.target.blur();
                                                                    if (e.key === 'ArrowDown') focusCell(0, column);
                                                                    if (e.key === 'Enter' && newRow.clientName.trim()) {
                                                                        addItem();
                                                                        setTimeout(() => focusCell('new', 'clientName'), 0);
                                                                    }
                                                                }}
                                                                className="py-0 px-1 h-5 text-[11px]"
                                                            />
                                                        );
                                                    }
                                            return (
                                                <td key={column} className="px-0.5 py-0 text-[11px] whitespace-nowrap overflow-hidden text-ellipsis border-r border-b border-gray-300"
                                                    style={column === 'country' && newRow.country ? { backgroundColor: countryColors[newRow.country] || '#F3F4F6' } : {}}>
                                                    {cell}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {/* Editable rows for each item */}
                                    {filteredSortedItems.map((item, rowIdx) => (
                                        <tr key={item.id} className="hover:bg-gray-50 border-b border-gray-300" style={{ backgroundColor: getStatusData(item.status)?.bgColor }}>
                                            {columnOrder.map((column, colIdx) => {
                                                const fieldMap = {
                                                    eventNum: 'eventNum',
                                                    clientName: 'clientName',
                                                    phoneNum: 'phoneNum',
                                                    city: 'city',
                                                    country: 'country',
                                                    mapsLocation: 'mapsLocation',
                                                    orderNum: 'orderNum',
                                                    order: 'order',
                                                    orderVal: 'orderVal',
                                                    paymentType: 'paymentType',
                                                    deliveryRepresentative: 'deliveryRepresentative',
                                                    delivered: 'delivered',
                                                };
                                                const field = fieldMap[column] || column;
                                                let cell = null;
                                                if (column === 'eventNum') {
                                                    cell = <span>{item.eventNum}</span>;
                                                } else if ([
                                                    'clientName','phoneNum','city','country','mapsLocation','orderNum','order','orderVal','deliveryRepresentative','delivered'
                                                ].includes(column)) {
                                                    if (column === 'phoneNum') {
                                                        cell = (
                                <Input 
                                                                ref={el => inputRefs.current[`${rowIdx}-${column}`] = el}
                                                                value={item.phoneNum || ''}
                                                                onChange={e => handleEditPhoneChange(item.id, e.target.value)}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Escape') e.target.blur();
                                                                    if (e.key === 'ArrowDown') focusCell(rowIdx + 1, column);
                                                                    if (e.key === 'ArrowUp') focusCell(rowIdx === 0 ? `new-${column}` : rowIdx - 1, column);
                                                                }}
                                                                className="py-0 px-1 h-5 text-[11px]"
                                                            />
                                                        );
                                                    } else {
                                                        cell = (
                                <Input 
                                                                ref={el => inputRefs.current[`${rowIdx}-${column}`] = el}
                                                                value={item[field] || ''}
                                                                onChange={e => editItem(item.id, field, e.target.value)}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Escape') e.target.blur();
                                                                    if (e.key === 'ArrowDown') focusCell(rowIdx + 1, column);
                                                                    if (e.key === 'ArrowUp') focusCell(rowIdx === 0 ? `new-${column}` : rowIdx - 1, column);
                                                                }}
                                                                className="py-0 px-1 h-5 text-[11px]"
                                                            />
                                                        );
                                                    }
                                                } else if (column === 'country') {
                                                    cell = (
                            <select 
                                                            ref={el => inputRefs.current[`${rowIdx}-${column}`] = el}
                                                            value={item.country}
                                                            onChange={e => editItem(item.id, 'country', e.target.value)}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Escape') e.target.blur();
                                                                if (e.key === 'ArrowDown') focusCell(rowIdx + 1, column);
                                                                if (e.key === 'ArrowUp') focusCell(rowIdx === 0 ? `new-${column}` : rowIdx - 1, column);
                                                            }}
                                                            className="w-full px-1 py-0 h-5 text-[11px] border rounded"
                                                        >
                                                            <option value="">Select country</option>
                                                            {countries.map(country => (
                                                                <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                                                    );
                                                } else if (column === 'status') {
                                                    cell = (
                                                        <select
                                                            ref={el => inputRefs.current[`${rowIdx}-${column}`] = el}
                                                            value={item.status}
                                                            onChange={e => editItem(item.id, 'status', e.target.value)}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Escape') e.target.blur();
                                                                if (e.key === 'ArrowDown') focusCell(rowIdx + 1, column);
                                                                if (e.key === 'ArrowUp') focusCell(rowIdx === 0 ? `new-${column}` : rowIdx - 1, column);
                                                            }}
                                                            className="w-full px-1 py-0 h-5 text-[11px] border rounded"
                                                        >
                                                            {statusOptions.map(opt => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </select>
                                                    );
                                                } else if (column === 'crmAgents') {
                                                    cell = (
                                                        <AgentCell
                                                            value={item.crmAgents}
                                                            onChange={agents => editItem(item.id, 'crmAgents', agents)}
                                                            isEditing={editingAgentsRow === item.id}
                                                            onEdit={() => setEditingAgentsRow(item.id)}
                                                            dropdownOpen={editingAgentsRow === item.id}
                                                            onDropdownClose={() => setEditingAgentsRow(null)}
                                                            agents={agents}
                                                        />
                                                    );
                                                } else if (column === 'paymentType') {
                                                    const paymentData = getPaymentData(item.paymentType);
                                                    cell = (
                                                        <div className="flex items-center gap-1">
                                                            <select
                                                                ref={el => inputRefs.current[`${rowIdx}-${column}`] = el}
                                                                value={item.paymentType}
                                                                onChange={e => editItem(item.id, 'paymentType', e.target.value)}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Escape') e.target.blur();
                                                                    if (e.key === 'ArrowDown') focusCell(rowIdx + 1, column);
                                                                    if (e.key === 'ArrowUp') focusCell(rowIdx === 0 ? `new-${column}` : rowIdx - 1, column);
                                                                }}
                                                                className="w-full px-1 py-0 h-5 text-[11px] border rounded"
                                                                style={paymentData ? { backgroundColor: paymentData.color + '20', color: paymentData.color, border: `1px solid ${paymentData.color}40` } : {}}
                                                            >
                                                                <option value="">Select payment</option>
                                                                {paymentMethods.map(opt => (
                                                                    <option key={opt.value} value={opt.value}>
                                                                        {opt.icon} {opt.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                </div>
                                                    );
                                                } else if (column === 'delivered') {
                                                    cell = (
                                                        <input
                                                            type="checkbox"
                                                            checked={!!item.delivered}
                                                            onChange={e => editItem(item.id, 'delivered', e.target.checked)}
                                                            className="h-4 w-4"
                                                        />
                                                    );
                                                } else if (column === 'startTime' || column === 'deliveryTime') {
                                                    cell = (
                                                        <input
                                                            type="datetime-local"
                                                            ref={el => inputRefs.current[`${rowIdx}-${column}`] = el}
                                                            value={item[column] || ''}
                                                            onChange={e => editItem(item.id, column, e.target.value)}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Escape') e.target.blur();
                                                                if (e.key === 'ArrowDown') focusCell(rowIdx + 1, column);
                                                                if (e.key === 'ArrowUp') focusCell(rowIdx === 0 ? `new-${column}` : rowIdx - 1, column);
                                                            }}
                                                            className="w-full px-1 py-0.5 h-7 text-xs border rounded"
                                                        />
                                                    );
                                                } else if (column === 'actions') {
                                                    cell = (
                                                        <div className="flex gap-1">
                                                            <Button size="icon" variant="ghost" onClick={() => setSelectedCustomer(item)}><Eye className="w-4 h-4" /></Button>
                                                            <Button size="icon" variant="ghost" onClick={() => deleteItem(item.id)}><Trash2 className="w-4 h-4" /></Button>
                                                        </div>
                                                    );
                                                } else if ([
                                                            'address', 'chatLink'
                                                        ].includes(column)) {
                                                            cell = (
                                                                <Input
                                                                    type={column === 'chatLink' ? 'url' : 'text'}
                                                                    ref={el => inputRefs.current[`${rowIdx}-${column}`] = el}
                                                                    value={item[field] || ''}
                                                                    onChange={e => editItem(item.id, field, e.target.value)}
                                                                    onKeyDown={e => {
                                                                        if (e.key === 'Escape') e.target.blur();
                                                                        if (e.key === 'ArrowDown') focusCell(rowIdx + 1, column);
                                                                        if (e.key === 'ArrowUp') focusCell(rowIdx === 0 ? `new-${column}` : rowIdx - 1, column);
                                                                    }}
                                                                    className="py-0 px-1 h-5 text-[11px]"
                                                                />
                                                            );
                                                        } else if ([
                                                            'crmAgentNotes', 'deliveryRepNotes', 'customerNotes'
                                                        ].includes(column)) {
                                                            cell = (
                                                                <textarea
                                                                    ref={el => inputRefs.current[`${rowIdx}-${column}`] = el}
                                                                    value={item[field] || ''}
                                                                    onChange={e => editItem(item.id, field, e.target.value)}
                                                                    onKeyDown={e => {
                                                                        if (e.key === 'Escape') e.target.blur();
                                                                        if (e.key === 'ArrowDown') focusCell(rowIdx + 1, column);
                                                                        if (e.key === 'ArrowUp') focusCell(rowIdx === 0 ? `new-${column}` : rowIdx - 1, column);
                                                                    }}
                                                                    className="py-0 px-1 h-5 text-[11px] w-full resize-vertical border rounded"
                                                                    rows={1}
                                                                />
                                                            );
                                                        } else if (column === 'orderVal') {
                                                            cell = (
                                                                <Input
                                                                    ref={el => inputRefs.current[`${rowIdx}-orderVal`] = el}
                                                                    value={item.orderVal || ''}
                                                                    onChange={e => handleEditOrderValChange(item.id, e.target.value)}
                                                                    inputMode="decimal"
                                                                    pattern="[0-9,.'']*"
                                                                    onKeyDown={e => {
                                                                        if (e.key === 'Escape') e.target.blur();
                                                                        if (e.key === 'ArrowDown') focusCell(rowIdx + 1, column);
                                                                        if (e.key === 'ArrowUp') focusCell(rowIdx === 0 ? `new-orderVal` : rowIdx - 1, column);
                                                                    }}
                                                                    className="py-0 px-1 h-5 text-[11px]"
                                                                />
                                                            );
                                                        }
                                                return (
                                                    <td key={column} className="px-0.5 py-0 text-[11px] whitespace-nowrap overflow-hidden text-ellipsis border-r border-gray-300 border-b"
                                                        style={column === 'country' && item.country ? { backgroundColor: countryColors[item.country] || '#F3F4F6' } : {}}>
                                                        {cell}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Vertical resize handle */}
                    <div 
                        className="h-2 bg-gray-100 border-t border-gray-200 cursor-row-resize hover:bg-gray-200 transition-colors flex items-center justify-center"
                        onMouseDown={handleHeightResizeStart}
                    >
                        <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                </div>

                {/* Customer Details Modal */}
                {selectedCustomer && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={e => {
                            if (e.target === e.currentTarget) setSelectedCustomer(null);
                        }}
                        tabIndex={-1}
                        onKeyDown={e => {
                            if (e.key === 'Escape') setSelectedCustomer(null);
                        }}
                    >
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold z-10"
                                onClick={() => setSelectedCustomer(null)}
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Customer Details - {selectedCustomer.clientName}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Client Name</label>
                                        <p className="text-sm text-gray-900">{selectedCustomer.clientName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Phone</label>
                                        <p className="text-sm text-gray-900">{selectedCustomer.phoneNum}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">City</label>
                                        <p className="text-sm text-gray-900">{selectedCustomer.city}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Country</label>
                                        <p className="text-sm text-gray-900">{selectedCustomer.country}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Location</label>
                                        <p className="text-sm text-gray-900">{selectedCustomer.mapsLocation}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Status</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs" 
                                                 style={{ backgroundColor: getStatusData(selectedCustomer.status)?.bgColor, color: getStatusData(selectedCustomer.status)?.textColor }}>
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStatusData(selectedCustomer.status)?.color }}></div>
                                                <span>{getStatusData(selectedCustomer.status)?.label}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Order</label>
                                        <p className="text-sm text-gray-900">{selectedCustomer.order}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Order Value</label>
                                        <p className="text-sm text-gray-900">{parseFloat(selectedCustomer.orderVal || 0).toFixed(2)} SAR</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-gray-500">CRM Agents</label>
                                        <div className="max-w-[110px] overflow-x-auto whitespace-nowrap flex gap-1 items-center">
                                            {selectedCustomer.crmAgents.map(agentName => {
                                                const emp = getEmployeeData(agentName);
                                                return (
                                                    <div key={agentName} className="inline-flex items-center gap-2 px-2 py-1 rounded text-xs"
                                                        style={{ backgroundColor: emp?.color + '20', color: emp?.color, border: `1px solid ${emp?.color}40` }}>
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: emp?.color }}></div>
                                                        <div>
                                                            <div className="font-medium">{agentName}</div>
                                                            <div className="text-xs opacity-75">{emp?.title}</div>
                                        </div>
                                    </div>
                                                );
                                            })}
                                </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}