[General]
NbElements=10
Description=RA7 6axes 2500
;PositionnementType=World
PositioningType=ParentBased


[Element1]
Source=file
Type=Polyhedron
Filename=BASE_PLATE.elt
Name=Base
Position=0,0,0
Color=100,100,100

[Element2]
Source=file
Type=Polyhedron
Filename=BASE.elt
Name=Base
Position=0,0,89.5
Color=100,100,100

[Element3]
Source=file
Type=Polyhedron
Filename=A.elt
Name=Axe A
Position=0,0,150
Rotation=0,0,0
Color=150,150,150
AxisRotation=Z

[Element4]
Source=file
Type=Polyhedron
Filename=BC25.elt
Name=Axe B
Position=0,0,137
Rotation=0,0,0
Color=150,150,150
AxisRotation=Y
AxisRotation_LimitMin=-80
AxisRotation_LimitMax=65

[Element5]
Source=file
Type=Polyhedron
Filename=C_FORK.elt
Name=Axe C
; Position.X must be equal to Tube1.Height
Position=711,0,62
Rotation=0,0,0
Color=150,150,150
AxisRotation=X

[Element6]
Source=file
Type=Polyhedron
Filename=DE25.elt
Name=Axe D
Position=39,0,0
Rotation=0,0,0
Color=150,150,150
AxisRotation=Y
AxisRotation_LimitMin=-90
AxisRotation_LimitMax=80

[Element7]
Source=file
Type=Polyhedron
Filename=F.elt
Name=Axe E
; Position.Z must be equal to -Tube2.Height
Position=62,0,-451.5
Rotation=0,0,0
Color=150,150,150
AxisRotation=Z

[Element8]
Source=file
Type=Polyhedron
Filename=F axis.elt
Name=Axe F
Position=0,0,-48.5
Rotation=0,0,0
Color=150,150,150
AxisRotation=Y
AxisRotation_LimitMin=-95
AxisRotation_LimitMax=95

[Element9]
Source=file
Type=Polyhedron
Filename=Buttons.elt
Name=Buttons
Position=0,0,0
Rotation=0,0,0
Color=0,0,0

[Element10]
Source=file
Type=Polyhedron
Filename=Empty.elt
Name=Probe
Position=0,15,-69.5
Rotation=0,0,0
Color=150,150,150
