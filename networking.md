A host on Network A (192.168.1.0/24) wants to send data to another host on Network B (192.168.2.0/24).

Explain step by step what happens from the moment an application sends data (say, via TCP or UDP) to the OS, all the way down to the wire and up to the destination host.

In your explanation, be sure to include and connect:

How the host decides whether the destination is on the same subnet or not.

What ARP operations occur — who sends them, who responds.

How MAC addresses and IP headers are used at each hop.

How the router processes and forwards the frame, including what gets rewritten and what stays the same.

How the destination host finally receives and interprets the data.


Support interface eth0 is R0, eth1 is R1
1. HostA realize that HostB's IP is in different network => Host A tend to deliver datagram to default gateway (R0)
2. But HostA don't know R0's MAC address, so HostA send an ARP message to get the address
3. Once switch receive ARP message from Host A, it broadcast to all interfaces. R0 receive message and response its MAC address
4. HostA receive the ARP response from R0 and forming complete datagram
    - source IP: 192.168.1.10     
    - source MAC: AA:AA:AA:AA:AA:AA
    - destination IP: 192.168.2.20
    - destination MAC: R1:1:1:1:1:1
5. Datagram then sent to SwitchA, SwitchA extract the destination MAC address and query its switch table
    - If there is an entry => switch forward datagram to that interface
    - If no entry:
        + switch send copies of datagram to all interfaces
        + R0 receive message and response at interface 2 of switch
        + switch create new entry for R0's MAC address and forward datagram to interface 2
6. Once R0 receive datagram, it using routing algorithm to know that IP:192.168.2.10 must go to eth1 or R1
7. R1 tend to send datagram to HostB but it don't know HostB's MAC address => R1 send an ARP message
8. Once switch receive ARP message from R1, it broadcast to all interfaces. HostB receive message and response its MAC address
9. R1 receive the ARP response from HostB and forming complete datagram
    - source IP: 192.168.1.10     
    - source MAC: R2:2:2:2:2:2
    - destination IP: 192.168.2.20
    - destination MAC: BB:BB:BB:BB:BB:BB
10. R1 then send complete datagram to HostB
11. When datagram reach SwitchB, it do the same process like SwitchA do in step 5 to forward datagram to HostB
12. HostB receive the datagram