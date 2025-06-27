import { useState, useEffect, useRef } from "react";
import { createPortal }                from "react-dom";
import { v4 as uuidv4 }                from "uuid";
import { Button }                      from "@/components/ui/button";
import { Input }                       from "@/components/ui/input";
import { Card }                        from "@/components/ui/card";
import { Badge }                       from "@/components/ui/badge";
import { Copy, Edit, Trash2, Eye, Plus, Search, Filter, Download } from "lucide-react";
import './App.css';


const jobPositions = [
    {job:"Manager",            color:"#F51111"  },
    {job:"Operation Manager",  color:"#F55F5F"  },
    {job:"Sales",              color:"#11B55F"  },
    {job:"Customer Service",   color:"#5F5FF5"  },

];


const employees = [
    { id: "emp4", name: "Yathreb Hamdi", phone: "+201888999000", position: "Manager",           employment_date: "", color: "#F51111", rank: 1, title: "Sales Representative" },
    { id: "emp2", name: "Mohamed Ahmed", phone: "+201112223334", position: "Operation Manager", employment_date: "", color: "#F55F5F", rank: 2, title: "Technical Support Specialist" },
    { id: "emp3", name: "Ahmed Ashraf",  phone: "+201555666777", position: "Sales",             employment_date: "", color: "#11B55F", rank: 3, title: "Engineer" },
    { id: "emp1", name: "Ahmed Farahat", phone: "+201234567890", position: "Customer Service",  employment_date: "", color: "#5F5FF5", rank: 1, title: "Engineer" },
    { id: "emp5", name: "Shrouq Alaa",   phone: "+201333444555", position: "Customer Service",  employment_date: "", color: "#5F5FF5", rank: 2, title: "Doctor" },
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

const countries = ["Saudi Arabia", "Egypt", "UAE", "Jordan", "Lebanon", "Kuwait", "Qatar"];

// 1. Add a unique color for the add-row
const ADD_ROW_COLOR = '#e0e7ef';

// 3. Country color map
const countryColors = {
    'Saudi Arabia':  '#A7F3D0',
    'Egypt':         '#FDE68A',
    'UAE':           '#BFDBFE',
    'Jordan':        '#FCA5A5',
    'Lebanon':       '#DDD6FE',
    'Kuwait':        '#FBCFE8',
    'Qatar':         '#FDE68A',
};

// PortalDropdown: renders children in a portal, positioned relative to a target element
function PortalDropdown({ anchorRef, open, onClose, children, width = 200 }) {
    const [pos, setPos] = useState(null);
    const menuRef = useRef();
    useEffect(() => {
        if (open && anchorRef?.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setPos({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width || width,
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
    return createPortal(
        <div
            ref={menuRef}
            style={{
                position: "absolute",
                top: pos.top,
                left: pos.left,
                minWidth: pos.width,
                zIndex: 1000,
            }}
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

export default function App() {
    const [items,             setItems             ] = useState([]);
    const [filter,            setFilter            ] = useState("");
    const [statusFilter,      setStatusFilter      ] = useState("");
    const [selectedCustomer,  setSelectedCustomer  ] = useState(null);
    const [newRow,            setNewRow            ] = useState({
        entryNumber:      null,
        clientName:      "",
        phoneNumber:     "",
        city:            "",
        country:         "Saudi Arabia",
        location:        "",
        mapsLocation:    "",
        status:          "New",
        orderNumber:     "",
        order:           "",
        orderValue:      "",
        crmAgent:        [],
        paymentMethod:   "",
        startDate:       getLocalDateTimeString(),
        endDate:         "",
        completionDate:  "",
        customerNotes:   "",
        delivery:        false,
        deliveryRepresentative: "",
        crmAgentNote:    "",
        chat:            "",
        chatOrder:       ""
    });

    const agents = employees.map((e) => e.name);

    // Add column widths state for resizable columns
    const defaultWidths = {
        actions: 90,
        entry: 60,
        client: 140,
        contact: 120,
        city: 90,
        country: 100,
        location: 120,
        mapsLocation: 120,
        status: 90,
        orderNumber: 110,
        order: 110,
        orderValue: 90,
        payment: 100,
        deliveryRepresentative: 130,
        agents: 120,
        startDate: 120,
        endDate: 120,
        delivery: 80,
        chat: 90,
        chatOrder: 90
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
    const [sortConfig, setSortConfig] = useState({ key: 'entryNumber', direction: 'desc' });
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
        if (key === 'orderValue') {
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

    // Assign entryNumber sequentially, descending
    const getNextEntryNumber = () => {
        if (items.length === 0) return 1;
        return Math.max(...items.map(i => i.entryNumber || 0)) + 1;
    };

    const addItem = () => {
        if (!newRow.clientName.trim()) return;
        const newItem = { id: uuidv4(), ...newRow, entryNumber: getNextEntryNumber() };
        setItems([newItem, ...items]);
        resetNewRow();
    };

    const resetNewRow = () => {
        setNewRow({
            entryNumber:      null,
            clientName:      "",
            phoneNumber:     "",
            city:            "",
            country:         "",
            location:        "",
            mapsLocation:    "",
            status:          "New",
            order:           "",
            orderValue:      "",
            orderNumber:     "",
            crmAgent:        [],
            paymentMethod:   "",
            startDate:       getLocalDateTimeString(),
            endDate:         "",
            completionDate:  "",
            customerNotes:   "",
            delivery:        false,
            deliveryRepresentative: "",
            crmAgentNote:    "",
            chat:            "",
            chatOrder:       ""
        });
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
        setNewRow({ ...newRow, phoneNumber: filtered });
    };

    // Handler for editing phone in existing rows
    const handleEditPhoneChange = (id, val) => {
        const filtered = val.replace(/[^\d+, ]/g, "");
        editItem(id, 'phoneNumber', filtered);
    };

    const toggleCrmAgent = (agent) => {
        setNewRow({
            ...newRow,
            crmAgent: newRow.crmAgent.includes(agent)
                ? newRow.crmAgent.filter((a) => a !== agent)
                : [...newRow.crmAgent, agent]
        });
    };

    const filteredItems = items.filter((item) => {
        const matchesSearch = item.clientName.toLowerCase().includes(filter.toLowerCase()) ||
                            item.phoneNumber.includes(filter) ||
                            item.location.toLowerCase().includes(filter.toLowerCase()) ||
                            item.city.toLowerCase().includes(filter.toLowerCase()) ||
                            item.orderNumber.toLowerCase().includes(filter.toLowerCase());
        
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
        e.stopPropagation(); // Prevent sorting when resizing
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
        'actions', 'entry', 'client', 'contact', 'city', 'country', 'location', 'mapsLocation', 
        'status', 'orderNumber', 'order', 'orderValue', 'payment', 'deliveryRepresentative', 'agents', 'startDate', 'endDate', 
        'delivery', 'chat', 'chatOrder', 
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
        
        return (
            <th 
                style={{width: colWidths[column]}} 
                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b relative cursor-move ${
                    isDragging ? 'opacity-50' : ''
                } ${isDragOver ? 'border-l-2 border-blue-500' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, column)}
                onDragOver={(e) => handleDragOver(e, column)}
                onDrop={(e) => handleDrop(e, column)}
                onDragEnd={handleDragEnd}
            >
                <div className="flex items-center justify-between">
                    <span onClick={() => handleSort(column === 'entry' ? 'entryNumber' : column)} className="cursor-pointer">
                        {
                            column === 'entry' ? '#' :
                            column === 'actions' ? 'Actions' :
                            column === 'client' ? 'Client' :
                            column === 'contact' ? 'Contact' :
                            column === 'city' ? 'City' :
                            column === 'country' ? 'Country' :
                            column === 'location' ? 'Location' :
                            column === 'mapsLocation' ? 'Maps' :
                            column === 'status' ? 'Status' :
                            column === 'orderNumber' ? 'Order #' :
                            column === 'order' ? 'Order' :
                            column === 'orderValue' ? 'Value' :
                            column === 'payment' ? 'Payment' :
                            column === 'deliveryRepresentative' ? 'Del. Rep.' :
                            column === 'agents' ? 'Agents' :
                            column === 'startDate' ? 'Start' :
                            column === 'endDate' ? 'End' :
                            column === 'delivery' ? 'Deliv.' :
                            column === 'chat' ? 'Chat' :
                            column === 'chatOrder' ? 'Chat Ord.' :
                            column
                        }
                    </span>
                    <div className="flex items-center gap-1">
                        <span className="text-gray-400 cursor-move select-none">⋮⋮</span>
                        <span onClick={() => handleSort(column === 'entry' ? 'entryNumber' : column)} className="cursor-pointer">
                            {getSortIndicator(column === 'entry' ? 'entryNumber' : column)}
                        </span>
                    </div>
                </div>
                <span 
                    className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize bg-gray-300" 
                    onMouseDown={(e) => handleResizeStart(column, e)}
                />
            </th>
        );
    };

    // Filtering logic
    const filteredSortedItems = sortedItems.filter((item) => {
        const matchesSearch = item.clientName.toLowerCase().includes(filter.toLowerCase()) ||
            item.phoneNumber.includes(filter) ||
            (item.location || '').toLowerCase().includes(filter.toLowerCase()) ||
            (item.city || '').toLowerCase().includes(filter.toLowerCase()) ||
            (item.orderNumber || '').toLowerCase().includes(filter.toLowerCase());
        const matchesStatus = statusMultiFilter.length === 0 || statusMultiFilter.includes(item.status);
        const matchesAgent = agentFilter.length === 0 || item.crmAgent.some(a => agentFilter.includes(a));
        const matchesPayment = paymentFilter.length === 0 || paymentFilter.includes(item.paymentMethod);
        const matchesDate = (!dateRange.from || (item.startDate && item.startDate >= dateRange.from)) &&
                            (!dateRange.to || (item.startDate && item.startDate <= dateRange.to));
        return matchesSearch && matchesStatus && matchesAgent && matchesPayment && matchesDate;
    });

    // Custom multi-select dropdown for agents (with z-30)
    function AgentsDropdown({ value, onChange, options, compact }) {
        const [open, setOpen] = useState(false);
        const btnRef = useRef();
        const toggle = () => setOpen((v) => !v);
        const handleOption = (agent) => {
            if (value.includes(agent)) {
                onChange(value.filter((a) => a !== agent));
            } else {
                onChange([...value, agent]);
            }
        };
        return (
            <div className="relative">
                <button type="button" ref={btnRef} className={`w-full border rounded bg-white text-left ${compact ? 'px-1 py-0.5 text-xs h-7' : 'px-2 py-1'} `} onClick={toggle}>
                    {value.length === 0 ? 'Select agent(s)' : (
                        <div className="flex flex-wrap gap-1">
                            {value.map(agentName => {
                                const emp = getEmployeeData(agentName);
                                return (
                                    <span   key={agentName} className="inline-flex items-center gap-1 px-1 py-0.5 rounded text-xs" 
                                            style={{ backgroundColor: emp?.color + '20', color: emp?.color, border: `1px solid ${emp?.color}40` }}>
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: emp?.color }}></div>
                                        {agentName}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </button>
                <PortalDropdown anchorRef={btnRef} open={open} onClose={() => setOpen(false)} width={compact ? 140 : 200}>
                    <div className={`z-30 bg-white border rounded shadow w-full max-h-40 overflow-y-auto mt-1 ${compact ? 'text-xs' : ''}`} style={{minWidth: btnRef.current?.offsetWidth}}>
                        {options.map(agentName => {
                            const emp = getEmployeeData(agentName);
                            return (
                                <label key={agentName} className={`flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100 ${compact ? 'py-0.5' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={value.includes(agentName)}
                                        onChange={() => handleOption(agentName)}
                                        className="mr-2"
                                    />
                                    <div className="flex items-center gap-2 flex-1">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: emp?.color }}></div>
                                        <div className="flex-1">
                                            <div className="font-medium">{agentName}</div>
                                            <div className="text-xs text-gray-500">{emp?.title}</div>
                                        </div>
                                        <div className="text-xs text-gray-400">Rank {emp?.rank}</div>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </PortalDropdown>
            </div>
        );
    }

    // Compact multi-select dropdown for status/payment
    function CompactMultiSelect({ value, onChange, options, placeholder, type = 'status' }) {
        const [open, setOpen] = useState(false);
        const toggle = () => setOpen((v) => !v);
        const handleOption = (opt) => {
            if (value.includes(opt)) {
                onChange(value.filter((a) => a !== opt));
            } else {
                onChange([...value, opt]);
            }
        };
        
        const getOptionData = (opt) => {
            if (type === 'status') {
                return statusOptions.find(s => s.value === opt);
            } else if (type === 'payment') {
                return paymentMethods.find(p => p.value === opt);
            }
            return null;
        };

        return (
            <div className="relative">
                <button type="button" className="w-full border rounded bg-white text-left px-1 py-0.5 text-xs h-7" onClick={toggle}>
                    {value.length === 0 ? placeholder : (
                        <div className="flex flex-wrap gap-1">
                            {value.map(opt => {
                                const data = getOptionData(opt);
                                if (type === 'status') {
                                    return (
                                        <span key={opt} className="inline-flex items-center gap-1 px-1 py-0.5 rounded text-xs" 
                                              style={{ backgroundColor: data?.bgColor, color: data?.textColor }}>
                                            {data?.label}
                                        </span>
                                    );
                                } else if (type === 'payment') {
                                    return (
                                        <span key={opt} className="inline-flex items-center gap-1 px-1 py-0.5 rounded text-xs" 
                                              style={{ backgroundColor: data?.color + '20', color: data?.color, border: `1px solid ${data?.color}40` }}>
                                            {data?.icon} {data?.label}
                                        </span>
                                    );
                                }
                                return opt;
                            })}
                        </div>
                    )}
                </button>
                {open && (
                    <div className="absolute z-30 bg-white border rounded shadow w-full max-h-40 overflow-y-auto mt-1 text-xs">
                        {options.map(opt => {
                            const data = getOptionData(opt);
                            return (
                                <label key={opt} className="flex items-center px-2 py-0.5 cursor-pointer hover:bg-gray-100">
                                    <input
                                        type="checkbox"
                                        checked={value.includes(opt)}
                                        onChange={() => handleOption(opt)}
                                        className="mr-2"
                                    />
                                    <div className="flex items-center gap-2">
                                        {type === 'status' && (
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data?.color }}></div>
                                        )}
                                        {type === 'payment' && (
                                            <span className="text-sm">{data?.icon}</span>
                                        )}
                                        <span>{data?.label || opt}</span>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

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
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-2 justify-between items-center mb-1">
                    <div className="flex gap-1 flex-wrap w-full sm:w-auto">
                        <Card className="p-2 flex flex-col items-center min-w-[70px]">
                            <div className="text-lg font-bold text-blue-600">{filteredSortedItems.length}</div>
                            <div className="text-[10px] text-gray-500 leading-tight">Customers</div>
                        </Card>
                        <Card className="p-2 flex flex-col items-center min-w-[70px]">
                            <div className="text-lg font-bold" style={{ color: getStatusData("Completed")?.color }}>
                                {filteredSortedItems.filter(item => item.status === "Completed").length}
                            </div>
                            <div className="text-[10px] text-gray-500 leading-tight">Completed</div>
                        </Card>
                        <Card className="p-2 flex flex-col items-center min-w-[70px]">
                            <div className="text-lg font-bold" style={{ color: getStatusData("In Progress")?.color }}>
                                {filteredSortedItems.filter(item => item.status === "In Progress").length}
                            </div>
                            <div className="text-[10px] text-gray-500 leading-tight">In Progress</div>
                        </Card>
                        <Card className="p-2 flex flex-col items-center min-w-[70px]">
                            <div className="text-lg font-bold text-purple-600">${filteredSortedItems.reduce((sum, item) => sum + (parseFloat(item.orderValue) || 0), 0).toFixed(2)}</div>
                            <div className="text-[10px] text-gray-500 leading-tight">Total Value</div>
                        </Card>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-1">
                    <div className="flex flex-nowrap gap-1 overflow-x-auto md:overflow-visible md:flex-wrap items-center">
                        <div className="min-w-[160px] flex-1">
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                                <Input 
                                    placeholder="Search..." 
                                    value={filter} 
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="pl-7 py-1 text-xs h-7 min-w-[120px]"
                                />
                            </div>
                        </div>
                        <div className="min-w-[110px]">
                            <CompactMultiSelect
                                value={statusMultiFilter}
                                onChange={setStatusMultiFilter}
                                options={statusOptions.map(s => s.value)}
                                placeholder="Status"
                                type="status"
                            />
                        </div>
                        <div className="min-w-[120px]">
                            <CompactMultiSelect
                                value={paymentFilter}
                                onChange={setPaymentFilter}
                                options={paymentMethods.map(p => p.value)}
                                placeholder="Payment"
                                type="payment"
                            />
                        </div>
                        <div className="min-w-[140px]">
                            <AgentsDropdown
                                value={agentFilter}
                                onChange={setAgentFilter}
                                options={agents}
                                compact
                            />
                        </div>
                        <div className="flex gap-1 items-center text-xs min-w-[140px]">
                            <span>From</span>
                            <input type="date" value={dateRange.from} onChange={e => setDateRange(r => ({ ...r, from: e.target.value }))} className="border rounded px-1 py-0.5 h-7 text-xs" />
                            <span>To</span>
                            <input type="date" value={dateRange.to} onChange={e => setDateRange(r => ({ ...r, to: e.target.value }))} className="border rounded px-1 py-0.5 h-7 text-xs" />
                        </div>
                    </div>
                </div>

                {/* Table with Horizontal Scroll */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="overflow-x-auto" style={{ height: tableHeight }}>
                        <div className="min-w-[2200px]">
                            <table className="w-full min-w-[2200px] text-xs" style={{ tableLayout: 'fixed' }}>
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        {columnOrder.map(column => (
                                            <ColumnHeader key={column} column={column}>
                                                {
                                                    column === 'entry' ? '#' :
                                                    column === 'actions' ? 'Actions' :
                                                    column === 'client' ? 'Client' :
                                                    column === 'contact' ? 'Contact' :
                                                    column === 'city' ? 'City' :
                                                    column === 'country' ? 'Country' :
                                                    column === 'location' ? 'Location' :
                                                    column === 'mapsLocation' ? 'Maps' :
                                                    column === 'status' ? 'Status' :
                                                    column === 'orderNumber' ? 'Order #' :
                                                    column === 'order' ? 'Order' :
                                                    column === 'orderValue' ? 'Value' :
                                                    column === 'payment' ? 'Payment' :
                                                    column === 'deliveryRepresentative' ? 'Del. Rep.' :
                                                    column === 'agents' ? 'Agents' :
                                                    column === 'startDate' ? 'Start' :
                                                    column === 'endDate' ? 'End' :
                                                    column === 'delivery' ? 'Deliv.' :
                                                    column === 'chat' ? 'Chat' :
                                                    column === 'chatOrder' ? 'Chat Ord.' :
                                                    column
                                                }
                                            </ColumnHeader>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* Empty row for new entry */}
                                    <tr className="border-b-2" style={{ backgroundColor: ADD_ROW_COLOR }}>
                                        {columnOrder.map((column, colIdx) => {
                                            const fieldMap = {
                                                entry: 'entryNumber',
                                                client: 'clientName',
                                                contact: 'phoneNumber',
                                                agents: 'crmAgent',
                                                payment: 'paymentMethod',
                                                deliveryRepresentative: 'deliveryRepresentative',
                                                delivery: 'delivery',
                                            };
                                            const field = fieldMap[column] || column;
                                            let cell = null;
                                            if (column === 'entry') {
                                                cell = <span />;
                                            } else if ([
                                                'client','contact','city','location','mapsLocation','orderNumber','order','orderValue','deliveryRepresentative','chat','chatOrder'
                                            ].includes(column)) {
                                                if (column === 'contact') {
                                                    cell = (
                                                        <Input
                                                            ref={el => inputRefs.current[`new-${column}`] = el}
                                                            value={newRow.phoneNumber || ''}
                                                            onChange={e => handlePhoneChange(e.target.value)}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Escape') e.target.blur();
                                                                if (e.key === 'ArrowDown') focusCell(0, column);
                                                            }}
                                                            className="py-1 px-2 h-7 text-xs"
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
                                                            }}
                                                            className="py-1 px-2 h-7 text-xs"
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
                                                        }}
                                                        className="w-full px-1 py-0.5 h-7 text-xs border rounded"
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
                                                        }}
                                                        className="w-full px-1 py-0.5 h-7 text-xs border rounded"
                                                    >
                                                        {statusOptions.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                );
                                            } else if (column === 'agents') {
                                                cell = (
                                                    <AgentsDropdown
                                                        value={newRow.crmAgent}
                                                        onChange={crmAgent => setNewRow({ ...newRow, crmAgent })}
                                                        options={agents}
                                                        compact
                                                    />
                                                );
                                            } else if (column === 'payment') {
                                                const paymentData = getPaymentData(newRow.paymentMethod);
                                                cell = (
                                                    <div className="flex items-center gap-1">
                                                        <select
                                                            ref={el => inputRefs.current[`new-${column}`] = el}
                                                            value={newRow.paymentMethod}
                                                            onChange={e => setNewRow({ ...newRow, paymentMethod: e.target.value })}
                                                            onKeyDown={e => {
                                                                if (e.key === 'Escape') e.target.blur();
                                                                if (e.key === 'ArrowDown') focusCell(0, column);
                                                            }}
                                                            className="w-full px-1 py-0.5 h-7 text-xs border rounded"
                                                            style={paymentData ? { backgroundColor: paymentData.color + '20', color: paymentData.color, border: `1px solid ${paymentData.color}40` } : {}}
                                                        >
                                                            <option value="">Select payment</option>
                                                            {paymentMethods.map(opt => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </select>
                                                        
                                                        {paymentData 
                                                            && (
                                                            <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded text-xs" style={{ backgroundColor: paymentData.color + '20', color: paymentData.color, border: `1px solid ${paymentData.color}40` }}>
                                                                <span>{paymentData.icon}</span>
                                                            </span>
                                                            )
                                                        }
                                                    </div>
                                                );
                                            } else if (column === 'delivery') {
                                                cell = (
                                                    <input
                                                        type="checkbox"
                                                        checked={!!newRow.delivery}
                                                        onChange={e => setNewRow({ ...newRow, delivery: e.target.checked })}
                                                        className="h-4 w-4"
                                                    />
                                                );
                                            } else if (column === 'startDate' || column === 'endDate') {
                                                cell = (
                                                    <input
                                                        type="datetime-local"
                                                        ref={el => inputRefs.current[`new-${column}`] = el}
                                                        value={newRow[column] || ''}
                                                        onChange={e => setNewRow({ ...newRow, [column]: e.target.value })}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Escape') e.target.blur();
                                                            if (e.key === 'ArrowDown') focusCell(0, column);
                                                        }}
                                                        className="w-full px-1 py-0.5 h-7 text-xs border rounded"
                                                    />
                                                );
                                            } else if (column === 'actions') {
                                                cell = (
                                                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={addItem}>
                                                        <Plus className="w-3 h-3 mr-1" /> Add
                                                    </Button>
                                                );
                                            }
                                            return (
                                                <td key={column} className="px-1 py-1 text-xs whitespace-nowrap overflow-hidden text-ellipsis"
                                                    style={column === 'country' && newRow.country ? { backgroundColor: countryColors[newRow.country] || '#F3F4F6' } : {}}>
                                                    {cell}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {/* Editable rows for each item */}
                                    {filteredSortedItems.map((item, rowIdx) => (
                                        <tr key={item.id} className="hover:bg-gray-50" style={{ backgroundColor: getStatusData(item.status)?.bgColor }}>
                                            {columnOrder.map((column, colIdx) => {
                                                const fieldMap = {
                                                    entry: 'entryNumber',
                                                    client: 'clientName',
                                                    contact: 'phoneNumber',
                                                    agents: 'crmAgent',
                                                    payment: 'paymentMethod',
                                                    deliveryRepresentative: 'deliveryRepresentative',
                                                    delivery: 'delivery',
                                                };
                                                const field = fieldMap[column] || column;
                                                let cell = null;
                                                if (column === 'entry') {
                                                    cell = <span>{item.entryNumber}</span>;
                                                } else if ([
                                                    'client','contact','city','location','mapsLocation','orderNumber','order','orderValue','deliveryRepresentative','chat','chatOrder'
                                                ].includes(column)) {
                                                    if (column === 'contact') {
                                                        cell = (
                                                            <Input
                                                                ref={el => inputRefs.current[`${rowIdx}-${column}`] = el}
                                                                value={item.phoneNumber || ''}
                                                                onChange={e => handleEditPhoneChange(item.id, e.target.value)}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Escape') e.target.blur();
                                                                    if (e.key === 'ArrowDown') focusCell(rowIdx + 1, column);
                                                                    if (e.key === 'ArrowUp') focusCell(rowIdx === 0 ? `new-${column}` : rowIdx - 1, column);
                                                                }}
                                                                className="py-1 px-2 h-7 text-xs"
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
                                                                className="py-1 px-2 h-7 text-xs"
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
                                                            className="w-full px-1 py-0.5 h-7 text-xs border rounded"
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
                                                            className="w-full px-1 py-0.5 h-7 text-xs border rounded"
                                                        >
                                                            {statusOptions.map(opt => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </select>
                                                    );
                                                } else if (column === 'agents') {
                                                    cell = (
                                                        <AgentsDropdown
                                                            value={item.crmAgent}
                                                            onChange={crmAgent => editItem(item.id, 'crmAgent', crmAgent)}
                                                            options={agents}
                                                            compact
                                                        />
                                                    );
                                                } else if (column === 'payment') {
                                                    const paymentData = getPaymentData(item.paymentMethod);
                                                    cell = (
                                                        <div className="flex items-center gap-1">
                                                            <select
                                                                ref={el => inputRefs.current[`${rowIdx}-${column}`] = el}
                                                                value={item.paymentMethod}
                                                                onChange={e => editItem(item.id, 'paymentMethod', e.target.value)}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Escape') e.target.blur();
                                                                    if (e.key === 'ArrowDown') focusCell(rowIdx + 1, column);
                                                                    if (e.key === 'ArrowUp') focusCell(rowIdx === 0 ? `new-${column}` : rowIdx - 1, column);
                                                                }}
                                                                className="w-full px-1 py-0.5 h-7 text-xs border rounded"
                                                                style={paymentData ? { backgroundColor: paymentData.color + '20', color: paymentData.color, border: `1px solid ${paymentData.color}40` } : {}}
                                                            >
                                                                <option value="">Select payment</option>
                                                                {paymentMethods.map(opt => (
                                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                                ))}
                                                            </select>
                                                            {paymentData && (
                                                                <span className="inline-flex items-center gap-1 px-1 py-0.5 rounded text-xs" style={{ backgroundColor: paymentData.color + '20', color: paymentData.color, border: `1px solid ${paymentData.color}40` }}>
                                                                    <span>{paymentData.icon}</span> {paymentData.label}
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                } else if (column === 'delivery') {
                                                    cell = (
                                                        <input
                                                            type="checkbox"
                                                            checked={!!item.delivery}
                                                            onChange={e => editItem(item.id, 'delivery', e.target.checked)}
                                                            className="h-4 w-4"
                                                        />
                                                    );
                                                } else if (column === 'startDate' || column === 'endDate') {
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
                                                }
                                                return (
                                                    <td key={column} className="px-1 py-1 text-xs whitespace-nowrap overflow-hidden text-ellipsis"
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
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Customer Details - {selectedCustomer.clientName}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Client Name</label>
                                        <p className="text-sm text-gray-900">{selectedCustomer.clientName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Phone</label>
                                        <p className="text-sm text-gray-900">{selectedCustomer.phoneNumber}</p>
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
                                        <p className="text-sm text-gray-900">{selectedCustomer.location}</p>
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
                                        <p className="text-sm text-gray-900">${parseFloat(selectedCustomer.orderValue || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-gray-500">CRM Agents</label>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedCustomer.crmAgent.map(agentName => {
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
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Payment Method</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            {selectedCustomer.paymentMethod ? (
                                                <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs" 
                                                     style={{ backgroundColor: getPaymentData(selectedCustomer.paymentMethod)?.color + '20', color: getPaymentData(selectedCustomer.paymentMethod)?.color, border: `1px solid ${getPaymentData(selectedCustomer.paymentMethod)?.color}40` }}>
                                                    <span>{getPaymentData(selectedCustomer.paymentMethod)?.icon}</span>
                                                    <span>{getPaymentData(selectedCustomer.paymentMethod)?.label}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500">Not specified</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <Button onClick={() => setSelectedCustomer(null)}>Close</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

