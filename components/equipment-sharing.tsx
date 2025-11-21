'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MapPin, Clock, TrendingUp, AlertCircle, CheckCircle, X, User, DollarSign, Search } from './icons';

interface ShareableEquipment {
  equipment_id: string;
  equipment_type: string;
  model: string;
  manufacturer: string;
  owner_site_name: string;
  owner_site_location: string;
  distance_km: number;
  utilization_rate: number;
  hourly_rate: number;
  condition: string;
  fuel_level: number;
}

interface SharingRecord {
  id: string;
  equipment_id: string;
  owner_site_name: string;
  borrower_site_name: string;
  sharing_start_date: string;
  sharing_end_date: string;
  hourly_rate: number;
  total_hours: number;
  total_cost: number;
  status: string;
  distance_km: number;
  sharing_reason: string;
}

export default function EquipmentSharing() {
  const [allEquipment, setAllEquipment] = useState<ShareableEquipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<ShareableEquipment[]>([]);
  const [sharingHistory, setSharingHistory] = useState<SharingRecord[]>([]);
  const [maxDistance, setMaxDistance] = useState(50);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('nearby');

  // Mock data for demonstration - this would come from your database
  const mockEquipment: ShareableEquipment[] = [
    // NYC Metro Area Equipment
    {
      equipment_id: 'EQ001',
      equipment_type: 'Excavator',
      model: '320D',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Downtown Manhattan Construction',
      owner_site_location: 'NYC Metro',
      distance_km: 0.5,
      utilization_rate: 15,
      hourly_rate: 85,
      condition: 'Excellent',
      fuel_level: 85
    },
    {
      equipment_id: 'EQ002',
      equipment_type: 'Crane',
      model: 'RT540E',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Brooklyn Bridge Project',
      owner_site_location: 'NYC Metro',
      distance_km: 8.5,
      utilization_rate: 25,
      hourly_rate: 90,
      condition: 'Good',
      fuel_level: 70
    },
    {
      equipment_id: 'EQ003',
      equipment_type: 'Bulldozer',
      model: 'D6T',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Queens Airport Expansion',
      owner_site_location: 'NYC Metro',
      distance_km: 15.7,
      utilization_rate: 10,
      hourly_rate: 80,
      condition: 'Excellent',
      fuel_level: 90
    },
    {
      equipment_id: 'EQ004',
      equipment_type: 'Grader',
      model: '140M',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Bronx Housing Development',
      owner_site_location: 'NYC Metro',
      distance_km: 12.3,
      utilization_rate: 20,
      hourly_rate: 75,
      condition: 'Good',
      fuel_level: 75
    },
    {
      equipment_id: 'EQ005',
      equipment_type: 'Loader',
      model: '950K',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Manhattan West Project',
      owner_site_location: 'NYC Metro',
      distance_km: 0.5,
      utilization_rate: 30,
      hourly_rate: 95,
      condition: 'Excellent',
      fuel_level: 80
    },
    {
      equipment_id: 'EQ006',
      equipment_type: 'Excavator',
      model: '336D',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Brooklyn Navy Yard',
      owner_site_location: 'NYC Metro',
      distance_km: 8.2,
      utilization_rate: 18,
      hourly_rate: 70,
      condition: 'Good',
      fuel_level: 65
    },
    {
      equipment_id: 'EQ007',
      equipment_type: 'Crane',
      model: 'M318F',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Queens Shopping Center',
      owner_site_location: 'NYC Metro',
      distance_km: 18.1,
      utilization_rate: 22,
      hourly_rate: 85,
      condition: 'Good',
      fuel_level: 70
    },
    {
      equipment_id: 'EQ008',
      equipment_type: 'Bulldozer',
      model: 'D7T',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Bronx River Project',
      owner_site_location: 'NYC Metro',
      distance_km: 12.3,
      utilization_rate: 12,
      hourly_rate: 75,
      condition: 'Excellent',
      fuel_level: 85
    },

    // LA Metro Area Equipment
    {
      equipment_id: 'EQ009',
      equipment_type: 'Excavator',
      model: '330D',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Downtown LA Tower',
      owner_site_location: 'LA Metro',
      distance_km: 0.0,
      utilization_rate: 16,
      hourly_rate: 90,
      condition: 'Excellent',
      fuel_level: 80
    },
    {
      equipment_id: 'EQ010',
      equipment_type: 'Crane',
      model: 'RT550E',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Venice Beach Development',
      owner_site_location: 'LA Metro',
      distance_km: 10.2,
      utilization_rate: 28,
      hourly_rate: 85,
      condition: 'Good',
      fuel_level: 75
    },
    {
      equipment_id: 'EQ011',
      equipment_type: 'Grader',
      model: '140M',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Hollywood Studio Project',
      owner_site_location: 'LA Metro',
      distance_km: 8.8,
      utilization_rate: 24,
      hourly_rate: 80,
      condition: 'Good',
      fuel_level: 70
    },
    {
      equipment_id: 'EQ012',
      equipment_type: 'Loader',
      model: '966K',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Santa Monica Pier',
      owner_site_location: 'LA Metro',
      distance_km: 15.3,
      utilization_rate: 32,
      hourly_rate: 75,
      condition: 'Good',
      fuel_level: 65
    },

    // Chicago Metro Area Equipment
    {
      equipment_id: 'EQ013',
      equipment_type: 'Excavator',
      model: '325D',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Loop Office Complex',
      owner_site_location: 'Chicago Metro',
      distance_km: 0.0,
      utilization_rate: 14,
      hourly_rate: 85,
      condition: 'Excellent',
      fuel_level: 85
    },
    {
      equipment_id: 'EQ014',
      equipment_type: 'Crane',
      model: 'RT540E',
      manufacturer: 'Caterpillar',
      owner_site_name: 'O\'Hare Airport Expansion',
      owner_site_location: 'Chicago Metro',
      distance_km: 18.5,
      utilization_rate: 26,
      hourly_rate: 80,
      condition: 'Good',
      fuel_level: 70
    },
    {
      equipment_id: 'EQ015',
      equipment_type: 'Bulldozer',
      model: 'D6T',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Navy Pier Renovation',
      owner_site_location: 'Chicago Metro',
      distance_km: 8.2,
      utilization_rate: 11,
      hourly_rate: 90,
      condition: 'Excellent',
      fuel_level: 90
    },
    {
      equipment_id: 'EQ016',
      equipment_type: 'Grader',
      model: '140M',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Wrigley Field Area',
      owner_site_location: 'Chicago Metro',
      distance_km: 12.1,
      utilization_rate: 21,
      hourly_rate: 85,
      condition: 'Good',
      fuel_level: 75
    },

    // Seattle Metro Area Equipment
    {
      equipment_id: 'EQ017',
      equipment_type: 'Excavator',
      model: '330D',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Seattle Downtown',
      owner_site_location: 'Seattle Metro',
      distance_km: 0.0,
      utilization_rate: 17,
      hourly_rate: 90,
      condition: 'Excellent',
      fuel_level: 80
    },
    {
      equipment_id: 'EQ018',
      equipment_type: 'Crane',
      model: 'RT550E',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Bellevue Tech Campus',
      owner_site_location: 'Seattle Metro',
      distance_km: 12.7,
      utilization_rate: 27,
      hourly_rate: 95,
      condition: 'Good',
      fuel_level: 75
    },
    {
      equipment_id: 'EQ019',
      equipment_type: 'Loader',
      model: '950K',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Tacoma Port Project',
      owner_site_location: 'Seattle Metro',
      distance_km: 28.3,
      utilization_rate: 33,
      hourly_rate: 75,
      condition: 'Good',
      fuel_level: 65
    },
    {
      equipment_id: 'EQ020',
      equipment_type: 'Bulldozer',
      model: 'D7T',
      manufacturer: 'Caterpillar',
      owner_site_name: 'Redmond Microsoft Campus',
      owner_site_location: 'Seattle Metro',
      distance_km: 15.8,
      utilization_rate: 13,
      hourly_rate: 85,
      condition: 'Excellent',
      fuel_level: 85
    }
  ];

  // Mock sharing history
  const mockSharingHistory: SharingRecord[] = [
    {
      id: 'SH001',
      equipment_id: 'EQ002',
      owner_site_name: 'Brooklyn Bridge Project',
      borrower_site_name: 'Downtown Manhattan Construction',
      sharing_start_date: '2024-01-15',
      sharing_end_date: '2024-01-20',
      hourly_rate: 90,
      total_hours: 40,
      total_cost: 3600,
      status: 'completed',
      distance_km: 8.5,
      sharing_reason: 'Bridge maintenance work'
    },
    {
      id: 'SH002',
      equipment_id: 'EQ005',
      owner_site_name: 'Manhattan West Project',
      borrower_site_name: 'Brooklyn Navy Yard',
      sharing_start_date: '2024-01-10',
      sharing_end_date: '2024-01-12',
      hourly_rate: 95,
      total_hours: 16,
      total_cost: 1520,
      status: 'active',
      distance_km: 8.7,
      sharing_reason: 'Loading operations'
    }
  ];

  useEffect(() => {
    setAllEquipment(mockEquipment);
    setSharingHistory(mockSharingHistory);
  }, []);

  useEffect(() => {
    // Filter equipment based on distance
    const filtered = allEquipment.filter(equipment => equipment.distance_km <= maxDistance);
    setFilteredEquipment(filtered);
  }, [maxDistance, allEquipment]);

  const handleDistanceChange = (value: string) => {
    const distance = parseInt(value) || 0;
    setMaxDistance(distance);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'cancelled': return <X className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getEquipmentTypeColor = (type: string) => {
    const colors = {
      'Excavator': 'bg-blue-100 text-blue-800',
      'Crane': 'bg-purple-100 text-purple-800',
      'Bulldozer': 'bg-orange-100 text-orange-800',
      'Grader': 'bg-green-100 text-green-800',
      'Loader': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Equipment Sharing</h2>
          <p className="text-muted-foreground">
            Find and share equipment across all construction sites within your specified distance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-8 w-8 text-blue-600" />
          <TrendingUp className="h-8 w-8 text-green-600" />
        </div>
      </div>

      {/* Simple Distance Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Find Equipment Within Distance</span>
          </CardTitle>
          <CardDescription>
            Enter a distance to see all available equipment across all locations within that range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="distance">Distance (kilometers)</Label>
              <Input
                type="number"
                value={maxDistance}
                onChange={(e) => handleDistanceChange(e.target.value)}
                min="1"
                max="200"
                placeholder="Enter distance in km"
                className="text-lg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {filteredEquipment.length} equipment found
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Available Equipment Within {maxDistance}km</h3>
          <div className="flex space-x-2">
            <Button 
              variant={activeTab === 'nearby' ? 'default' : 'outline'}
              onClick={() => setActiveTab('nearby')}
            >
              Equipment ({filteredEquipment.length})
            </Button>
            <Button 
              variant={activeTab === 'history' ? 'default' : 'outline'}
              onClick={() => setActiveTab('history')}
            >
              History ({sharingHistory.length})
            </Button>
          </div>
        </div>

        {activeTab === 'nearby' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipment.map((equipment) => (
              <Card key={equipment.equipment_id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{equipment.equipment_type}</CardTitle>
                    <Badge className={getEquipmentTypeColor(equipment.equipment_type)}>
                      {equipment.equipment_type}
                    </Badge>
                  </div>
                  <CardDescription>
                    {equipment.manufacturer} {equipment.model}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{equipment.owner_site_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Badge variant="outline">{equipment.owner_site_location}</Badge>
                    <Badge variant="outline">{equipment.distance_km.toFixed(1)} km away</Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <span>Utilization: {equipment.utilization_rate.toFixed(1)}%</span>
                    <Badge variant={equipment.utilization_rate < 30 ? "default" : "secondary"}>
                      {equipment.utilization_rate < 30 ? "Low Usage" : "Medium Usage"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">${equipment.hourly_rate}/hour</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-xs text-gray-500">Condition: {equipment.condition}</span>
                    <span className="text-xs text-gray-500">Fuel: {equipment.fuel_level}%</span>
                  </div>
                  <Button 
                    className="w-full"
                    disabled={equipment.utilization_rate >= 50}
                  >
                    Request Sharing
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Equipment</th>
                      <th className="text-left p-4">Owner</th>
                      <th className="text-left p-4">Borrower</th>
                      <th className="text-left p-4">Duration</th>
                      <th className="text-left p-4">Rate</th>
                      <th className="text-left p-4">Total Cost</th>
                      <th className="text-left p-4">Distance</th>
                      <th className="text-left p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sharingHistory.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{record.equipment_id}</td>
                        <td className="p-4">{record.owner_site_name}</td>
                        <td className="p-4">{record.borrower_site_name}</td>
                        <td className="p-4">
                          {new Date(record.sharing_start_date).toLocaleDateString()} - 
                          {new Date(record.sharing_end_date).toLocaleDateString()}
                        </td>
                        <td className="p-4">${record.hourly_rate}/hr</td>
                        <td className="p-4">${record.total_cost}</td>
                        <td className="p-4">{record.distance_km.toFixed(1)} km</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(record.status)}
                            <Badge className={getStatusBadge(record.status)}>
                              {record.status}
                            </Badge>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'nearby' && filteredEquipment.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No equipment found within {maxDistance}km</p>
                <p className="text-sm">Try increasing the distance to see more options</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
