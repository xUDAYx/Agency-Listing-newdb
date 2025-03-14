"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { X, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Service {
    serviceName: string;
    slug: string;
}

interface ServiceSelectProps {
    value: string[];
    onChange: (value: string[]) => void;
}

export function ServiceSelect({ value, onChange }: ServiceSelectProps) {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [services, setServices] = React.useState<Service[]>([]);

    const fetchServices = async () => {
        try {
            const response = await fetch('/api/services');
            const data = await response.json();
            if (Array.isArray(data)) {
                setServices(data);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    React.useEffect(() => {
        fetchServices();
    }, []);

    const handleUnselect = (serviceName: string) => {
        onChange(value.filter((s) => s !== serviceName));
    };

    const handleSelect = (serviceName: string) => {
        if (!value.includes(serviceName)) {
            onChange([...value, serviceName]);
            setSearchQuery(""); // Clear search after selection
        }
    };

    const handleAddCustom = () => {
        const customService = searchQuery.trim();
        if (customService && !value.includes(customService)) {
            onChange([...value, customService]);
            setSearchQuery(""); // Clear search after adding
        }
    };

    const filteredServices = services.filter((service) =>
        service.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const showAddCustom = searchQuery.trim().length > 0 && filteredServices.length === 0;

    return (
        <div className="space-y-4">
            {/* Selected Services */}
            <div className="flex flex-wrap gap-2">
                {value.map((serviceName) => (
                    <Badge 
                        key={serviceName} 
                        variant="secondary" 
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 py-2"
                    >
                        {serviceName}
                        <button
                            className="ml-2"
                            onClick={() => handleUnselect(serviceName)}
                        >
                            <X className="h-3 w-3 text-blue-700 hover:text-blue-900" />
                        </button>
                    </Badge>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search or type custom service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Services Grid */}
            <ScrollArea className="h-[200px] rounded-md border">
                <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {filteredServices.map((service) => (
                            <Card
                                key={service.slug}
                                className={`p-3 cursor-pointer transition-colors ${
                                    value.includes(service.serviceName)
                                        ? 'bg-primary/5 border-primary'
                                        : 'hover:bg-muted'
                                }`}
                                onClick={() => handleSelect(service.serviceName)}
                            >
                                <p className="text-sm font-medium truncate">
                                    {service.serviceName}
                                </p>
                            </Card>
                        ))}
                    </div>
                    {showAddCustom && (
                        <div className="mt-4 p-4 border border-dashed rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Plus className="h-4 w-4" />
                                    <span className="text-sm">Add custom service:</span>
                                    <span className="font-medium text-foreground">
                                        {searchQuery}
                                    </span>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={handleAddCustom}
                                >
                                    Add
                                </Button>
                            </div>
                        </div>
                    )}
                    {!showAddCustom && filteredServices.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                            No services found. Type to add custom service.
                        </p>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
} 