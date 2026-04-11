'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectOption } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Settings, School, Calendar, User } from 'lucide-react'

export function TeacherSettings() {
  const [className, setClassName] = useState('X-IPA-1')
  const [schoolName, setSchoolName] = useState('SMA Negeri 1 Jakarta')
  const [grade, setGrade] = useState('10')
  const [academicYear, setAcademicYear] = useState('2025/2026')
  const [semester, setSemester] = useState('2')
  const [fullName, setFullName] = useState('Ibu Ratna Dewi')
  const [email, setEmail] = useState('ratna.dewi@sman1jkt.sch.id')
  const [subject, setSubject] = useState('Fisika')

  return (
    <div className="max-w-2xl space-y-6">
      {/* Class Information */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-4 w-4 text-cyan-400" />
            Class Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="className">Class Name</Label>
              <Input
                id="className"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="school">School</Label>
              <Input
                id="school"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade">Grade Level</Label>
            <Select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <SelectOption value="10">Grade 10</SelectOption>
              <SelectOption value="11">Grade 11</SelectOption>
              <SelectOption value="12">Grade 12</SelectOption>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Academic Year */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-400" />
            Academic Year
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Academic Year</Label>
              <Input
                id="year"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <SelectOption value="1">Semester 1 (Ganjil)</SelectOption>
                <SelectOption value="2">Semester 2 (Genap)</SelectOption>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Profile */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4 text-amber-400" />
            Personal Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gap-2 bg-purple-600 text-white hover:bg-purple-700">
          <Settings className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
