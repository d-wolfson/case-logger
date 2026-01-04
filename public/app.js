// ============================================
// CASE LOGGER - Frontend JavaScript
// ============================================

// --------------------------------------------
// CPT Code Lookup (Comprehensive Neurosurgery)
// --------------------------------------------
const CPT_DESCRIPTIONS = {
  // Cranial - Tumor
  '61304': 'Craniectomy or craniotomy, exploratory; supratentorial',
  '61305': 'Craniectomy or craniotomy, exploratory; infratentorial (posterior fossa)',
  '61312': 'Craniectomy for evacuation of hematoma, supratentorial; extradural (epidural)',
  '61313': 'Craniectomy for evacuation of hematoma, supratentorial; subdural',
  '61314': 'Craniectomy for evacuation of hematoma, supratentorial; intracerebral',
  '61315': 'Craniectomy for evacuation of hematoma, infratentorial; extradural or subdural',
  '61316': 'Craniectomy for evacuation of hematoma, infratentorial; intracerebral',
  '61320': 'Craniectomy or craniotomy, drainage of intracranial abscess; supratentorial',
  '61321': 'Craniectomy or craniotomy, drainage of intracranial abscess; infratentorial',
  '61500': 'Craniectomy; with excision of tumor or other bone lesion of skull',
  '61510': 'Craniectomy, trephination, bone flap craniotomy; for excision of brain tumor, supratentorial, except meningioma',
  '61512': 'Craniotomy for excision of meningioma, supratentorial',
  '61514': 'Craniectomy, trephination, bone flap craniotomy; for excision of brain abscess, supratentorial',
  '61516': 'Craniotomy for excision or fenestration of cyst, supratentorial',
  '61517': 'Implantation of brain intracavitary chemotherapy agent (add-on)',
  '61518': 'Craniectomy for excision of brain tumor, infratentorial or posterior fossa, except meningioma, cerebellopontine angle tumor, or midline tumor at base of skull',
  '61519': 'Craniectomy for excision of brain tumor, infratentorial or posterior fossa; meningioma',
  '61520': 'Craniectomy for excision of cerebellopontine angle tumor',
  '61521': 'Craniectomy for excision of midline tumor at base of skull',
  '61522': 'Craniectomy, infratentorial or posterior fossa; for excision of brain abscess',
  '61524': 'Craniectomy, infratentorial or posterior fossa; for excision or fenestration of cyst',
  '61526': 'Craniectomy, bone flap craniotomy, transtemporal (mastoid) for excision of cerebellopontine angle tumor',
  '61530': 'Craniectomy for excision of cerebellopontine angle tumor, combined with middle/posterior fossa craniotomy/craniectomy',
  '61531': 'Subdural implantation of strip electrodes for long-term seizure monitoring',
  '61533': 'Craniotomy with elevation of bone flap; for subdural implantation of electrode array for long-term seizure monitoring',
  '61534': 'Craniotomy with elevation of bone flap; for excision of epileptogenic focus without electrocorticography',
  '61535': 'Craniotomy with elevation of bone flap; for removal of epidural or subdural electrode array',
  '61536': 'Craniotomy with elevation of bone flap; for excision of epileptogenic focus with electrocorticography during surgery',
  '61537': 'Craniotomy with lobectomy, temporal lobe, without electrocorticography',
  '61538': 'Craniotomy with lobectomy, temporal lobe, with electrocorticography',
  '61539': 'Craniotomy with lobectomy, other than temporal lobe, partial or total, with electrocorticography',
  '61540': 'Craniotomy with lobectomy, other than temporal lobe, partial or total, without electrocorticography',
  '61541': 'Craniotomy with transection of corpus callosum',
  '61543': 'Craniotomy with lobectomy for craniosynostosis',
  '61544': 'Craniotomy with excision of choroid plexus',
  '61545': 'Craniotomy with excision of craniopharyngioma',
  '61546': 'Craniotomy for hypophysectomy or excision of pituitary tumor, intracranial approach',
  '61548': 'Hypophysectomy or excision of pituitary tumor, transnasal or transseptal approach, nonstereotactic',
  '61550': 'Craniectomy for craniosynostosis; single suture',
  '61552': 'Craniectomy for craniosynostosis; multiple sutures',
  '61556': 'Craniotomy for craniosynostosis; frontal or parietal bone flap',
  '61557': 'Craniotomy for craniosynostosis; bifrontal bone flap',
  '61558': 'Craniectomy, extensive, for multiple cranial suture craniosynostosis',
  '61559': 'Craniectomy with extracranial reshaping for craniosynostosis',
  '61563': 'Excision, intra and extracranial, benign tumor of cranial bone; without optic nerve decompression',
  '61564': 'Excision, intra and extracranial, benign tumor of cranial bone; with optic nerve decompression',
  '61566': 'Craniotomy with excision of foreign body from brain',
  '61567': 'Craniotomy with multiple subpial transections, with or without electrocorticography',
  '61570': 'Craniectomy or craniotomy; with excision of foreign body from brain',
  '61571': 'Craniectomy or craniotomy; with treatment of penetrating wound of brain',
  '61575': 'Skull base approach; transoral approach to skull base, extradural',
  '61576': 'Skull base approach; transoral approach to skull base with excision of lesion, extradural',

  // Cranial - Vascular
  '61680': 'Surgery of intracranial arteriovenous malformation; supratentorial, simple',
  '61682': 'Surgery of intracranial arteriovenous malformation; supratentorial, complex',
  '61684': 'Surgery of intracranial arteriovenous malformation; infratentorial, simple',
  '61686': 'Surgery of intracranial arteriovenous malformation; infratentorial, complex',
  '61690': 'Surgery of intracranial arteriovenous malformation; dural, simple',
  '61692': 'Surgery of intracranial arteriovenous malformation; dural, complex',
  '61697': 'Surgery of complex intracranial aneurysm, intracranial approach; carotid circulation',
  '61698': 'Surgery of complex intracranial aneurysm, intracranial approach; vertebrobasilar circulation',
  '61700': 'Surgery of simple intracranial aneurysm, intracranial approach; carotid circulation',
  '61702': 'Surgery of simple intracranial aneurysm, intracranial approach; vertebrobasilar circulation',
  '61703': 'Surgery of intracranial aneurysm, cervical approach by ligation of carotid artery',
  '61705': 'Surgery of intracranial aneurysm; by anastomosis of carotid arteries',
  '61708': 'Surgery of intracranial aneurysm; by intracranial microvascular bypass',
  '61710': 'Surgery of intracranial aneurysm; by intra-arterial embolization',
  '61711': 'Anastomosis, arterial, extracranial-intracranial (EC-IC bypass)',

  // Stereotactic/Functional
  '61720': 'Creation of lesion by stereotactic method; globus pallidus or thalamus',
  '61735': 'Creation of lesion by stereotactic method; subcortical structure other than globus pallidus or thalamus',
  '61750': 'Stereotactic biopsy, aspiration, or excision of intracranial lesion, including burr hole; without computed tomography or MRI guidance',
  '61751': 'Stereotactic biopsy, aspiration, or excision of intracranial lesion, including burr hole; with computed tomography and/or MRI guidance',
  '61760': 'Stereotactic implantation of depth electrodes for long-term seizure monitoring',
  '61770': 'Stereotactic localization, including burr hole(s), with insertion of catheter(s) or probe(s) for placement of radiation source',
  '61781': 'Stereotactic computer-assisted (navigational) procedure; cranial, intradural (add-on)',
  '61782': 'Stereotactic computer-assisted (navigational) procedure; cranial, extradural (add-on)',
  '61783': 'Stereotactic computer-assisted (navigational) procedure; spinal (add-on)',
  '61790': 'Creation of lesion by stereotactic method, percutaneous, by neurolytic agent; trigeminal nerve (gasserian ganglion)',
  '61791': 'Creation of lesion by stereotactic method, percutaneous, by neurolytic agent; trigeminal medullary tract',
  '61796': 'Stereotactic radiosurgery (particle beam, gamma ray, or linear accelerator); 1 simple cranial lesion',
  '61797': 'Stereotactic radiosurgery; each additional cranial lesion, simple (add-on)',
  '61798': 'Stereotactic radiosurgery; 1 complex cranial lesion',
  '61799': 'Stereotactic radiosurgery; each additional cranial lesion, complex (add-on)',
  '61800': 'Application of stereotactic headframe for stereotactic radiosurgery',
  '61850': 'Twist drill or burr hole(s) for implantation of neurostimulator electrodes; cortical',
  '61860': 'Craniectomy or craniotomy for implantation of neurostimulator electrodes, cerebral; cortical',
  '61863': 'Twist drill, burr hole, craniotomy for implantation of neurostimulator electrodes, subthalamic nucleus',
  '61864': 'Twist drill, burr hole, craniotomy for implantation of neurostimulator electrodes, globus pallidus',
  '61867': 'Twist drill, burr hole, craniotomy for implantation of neurostimulator electrodes, thalamus',
  '61868': 'Twist drill, burr hole, craniotomy for implantation of neurostimulator electrodes, cerebellum',
  '61880': 'Revision or removal of intracranial neurostimulator electrodes',
  '61885': 'Insertion of cranial neurostimulator pulse generator/receiver, subcutaneous',
  '61886': 'Insertion of cranial neurostimulator pulse generator/receiver, subcutaneous; with connection to 2 or more electrode arrays',

  // CSF Diversion/Shunts
  '62000': 'Elevation of depressed skull fracture; simple, extradural',
  '62005': 'Elevation of depressed skull fracture; compound or comminuted, extradural',
  '62010': 'Elevation of depressed skull fracture; with repair of dura and/or debridement of brain',
  '62100': 'Craniotomy for repair of dural/cerebrospinal fluid leak, including surgery for rhinorrhea/otorrhea',
  '62115': 'Reduction of craniomegalic skull (surgical treatment of macrocephaly)',
  '62116': 'Reduction of craniomegalic skull; with simple shunt',
  '62117': 'Reduction of craniomegalic skull; with craniectomy/osteotomy',
  '62120': 'Repair of encephalocele, skull vault, including cranioplasty',
  '62121': 'Repair of encephalocele; skull base',
  '62140': 'Cranioplasty for skull defect; up to 5 cm diameter',
  '62141': 'Cranioplasty for skull defect; greater than 5 cm diameter',
  '62142': 'Removal of bone flap or prosthetic plate of skull',
  '62143': 'Replacement of bone flap or prosthetic plate of skull',
  '62145': 'Cranioplasty for skull defect with reparative brain surgery',
  '62146': 'Cranioplasty with autograft (includes obtaining bone graft); up to 5 cm diameter',
  '62147': 'Cranioplasty with autograft; greater than 5 cm diameter',
  '62148': 'Cranioplasty with autograft, including obtaining bone graft(s)',
  '62160': 'Neuroendoscopy, intracranial; for placement or replacement of ventricular catheter and target biopsy',
  '62161': 'Neuroendoscopy, intracranial; for lysis of adhesions, fenestration of septum pellucidum or cyst, shunt placement or replacement',
  '62162': 'Neuroendoscopy, intracranial; for third ventriculostomy (ETV)',
  '62163': 'Neuroendoscopy, intracranial; with retrieval of foreign body',
  '62164': 'Neuroendoscopy, intracranial; with excision of brain tumor',
  '62165': 'Neuroendoscopy, intracranial; with excision of pituitary tumor, transnasal or transsphenoidal approach',
  '62180': 'Ventriculocisternostomy (Torkildsen procedure)',
  '62190': 'Creation of shunt; subarachnoid/subdural-atrial, -jugular, -auricular',
  '62192': 'Creation of shunt; subarachnoid/subdural-peritoneal, -pleural, other terminus',
  '62194': 'Replacement or irrigation, subarachnoid/subdural catheter',
  '62200': 'Ventriculocisternostomy, third ventricle; stereotactic, neuroendoscopic, or by craniotomy',
  '62201': 'Ventriculocisternostomy, third ventricle; stereotactic, neuroendoscopic, with placement of ventricular catheter and target biopsy',
  '62220': 'Creation of shunt; ventriculo-atrial, -jugular, -auricular (VP shunt to heart)',
  '62223': 'Creation of shunt; ventriculo-peritoneal, -pleural, other terminus (VP shunt)',
  '62225': 'Replacement or irrigation of ventricular catheter',
  '62230': 'Replacement or revision of cerebrospinal fluid shunt, obstructed valve, or distal catheter in shunt system',
  '62252': 'Reprogramming of programmable cerebrospinal shunt',
  '62256': 'Removal of complete cerebrospinal fluid shunt system; without replacement',
  '62258': 'Removal of complete cerebrospinal fluid shunt system; with replacement by similar or other shunt at same operation',
  '62263': 'Percutaneous lysis of epidural adhesions using solution injection',
  '62264': 'Percutaneous lysis of epidural adhesions using solution injection, multiple sessions',
  '62268': 'Percutaneous aspiration, spinal cord cyst or syrinx',
  '62269': 'Biopsy of spinal cord, percutaneous needle',
  '62270': 'Spinal puncture, lumbar, diagnostic',
  '62272': 'Spinal puncture, therapeutic, for drainage of cerebrospinal fluid',
  '62273': 'Injection, epidural, of blood or clot patch',
  '62280': 'Injection/infusion of neurolytic substance; subarachnoid',
  '62281': 'Injection/infusion of neurolytic substance; epidural, cervical or thoracic',
  '62282': 'Injection/infusion of neurolytic substance; epidural, lumbar or sacral (caudal)',
  '62284': 'Injection procedure for myelography and/or computed tomography, lumbar',
  '62287': 'Decompression procedure, percutaneous, of nucleus pulposus of intervertebral disc, any method, single or multiple levels, lumbar',
  '62290': 'Injection procedure for discography, each level; lumbar',
  '62291': 'Injection procedure for discography, each level; cervical or thoracic',
  '62292': 'Injection procedure for chemonucleolysis, including discography; lumbar',
  '62302': 'Myelography via lumbar injection; cervical',
  '62303': 'Myelography via lumbar injection; thoracic',
  '62304': 'Myelography via lumbar injection; lumbosacral',
  '62305': 'Myelography via lumbar injection; 2 or more regions',
  '62320': 'Injection(s), of diagnostic or therapeutic substance(s); cervical or thoracic, without imaging guidance',
  '62321': 'Injection(s), of diagnostic or therapeutic substance(s); cervical or thoracic, with imaging guidance',
  '62322': 'Injection(s), of diagnostic or therapeutic substance(s); lumbar or sacral (caudal), without imaging guidance',
  '62323': 'Injection(s), of diagnostic or therapeutic substance(s); lumbar or sacral (caudal), with imaging guidance',
  '62324': 'Injection, including indwelling catheter placement, continuous infusion or intermittent bolus; cervical or thoracic, without imaging guidance',
  '62325': 'Injection, including indwelling catheter placement, continuous infusion or intermittent bolus; cervical or thoracic, with imaging guidance',
  '62326': 'Injection, including indwelling catheter placement, continuous infusion or intermittent bolus; lumbar or sacral (caudal), without imaging guidance',
  '62327': 'Injection, including indwelling catheter placement, continuous infusion or intermittent bolus; lumbar or sacral (caudal), with imaging guidance',
  '62350': 'Implantation, revision or repositioning of tunneled intrathecal or epidural catheter; without laminectomy',
  '62351': 'Implantation, revision or repositioning of tunneled intrathecal or epidural catheter; with laminectomy',
  '62355': 'Removal of previously implanted intrathecal or epidural catheter',
  '62360': 'Implantation or replacement of device for intrathecal or epidural drug infusion; subcutaneous reservoir',
  '62361': 'Implantation or replacement of device for intrathecal or epidural drug infusion; nonprogrammable pump',
  '62362': 'Implantation or replacement of device for intrathecal or epidural drug infusion; programmable pump',
  '62365': 'Removal of subcutaneous reservoir or pump, previously implanted for intrathecal or epidural infusion',
  '62367': 'Electronic analysis of programmable, implanted pump for intrathecal or epidural drug infusion; without reprogramming',
  '62368': 'Electronic analysis of programmable, implanted pump for intrathecal or epidural drug infusion; with reprogramming',
  '62369': 'Electronic analysis of programmable, implanted pump for intrathecal or epidural drug infusion; with reprogramming and refill',
  '62370': 'Electronic analysis of programmable, implanted pump for intrathecal or epidural drug infusion; with reprogramming and refill (requiring skill of a physician)',

  // Spine - Cervical
  '22551': 'Arthrodesis, anterior interbody; cervical below C2 (ACDF single level)',
  '22552': 'Arthrodesis, anterior interbody; cervical below C2, each additional interspace (ACDF add-on)',
  '22554': 'Arthrodesis, anterior interbody technique; cervical below C2',
  '22556': 'Arthrodesis, anterior interbody technique; thoracic',
  '22558': 'Arthrodesis, anterior interbody technique; lumbar (ALIF)',
  '22585': 'Arthrodesis, anterior interbody; each additional interspace (add-on)',
  '22590': 'Arthrodesis, posterior technique, craniocervical (occiput-C2)',
  '22595': 'Arthrodesis, posterior technique, atlas-axis (C1-C2)',
  '22600': 'Arthrodesis, posterior or posterolateral technique; cervical below C2 segment',
  '22610': 'Arthrodesis, posterior or posterolateral technique; thoracic (with or without lateral transverse technique)',
  '22612': 'Arthrodesis, posterior or posterolateral technique; lumbar (with or without lateral transverse technique, PLF)',
  '22614': 'Arthrodesis, posterior or posterolateral technique; each additional vertebral segment (add-on)',
  '22630': 'Arthrodesis, posterior interbody technique, including laminectomy/discectomy to prepare interspace; lumbar (PLIF)',
  '22632': 'Arthrodesis, posterior interbody technique; each additional interspace (add-on)',
  '22633': 'Arthrodesis, combined posterior or posterolateral technique with posterior interbody technique; lumbar (TLIF)',
  '22634': 'Arthrodesis, combined posterior or posterolateral technique with posterior interbody technique; each additional interspace (add-on)',
  '22800': 'Arthrodesis, posterior, for spinal deformity, with or without cast; up to 6 vertebral segments',
  '22802': 'Arthrodesis, posterior, for spinal deformity, with or without cast; 7 to 12 vertebral segments',
  '22804': 'Arthrodesis, posterior, for spinal deformity, with or without cast; 13 or more vertebral segments',
  '22808': 'Arthrodesis, anterior, for spinal deformity, with or without cast; 2 to 3 vertebral segments',
  '22810': 'Arthrodesis, anterior, for spinal deformity, with or without cast; 4 to 7 vertebral segments',
  '22812': 'Arthrodesis, anterior, for spinal deformity, with or without cast; 8 or more vertebral segments',
  '22818': 'Kyphectomy, circumferential exposure of spine and resection of vertebral segment; single or 2 segments',
  '22819': 'Kyphectomy, circumferential exposure of spine and resection of vertebral segment; 3 or more segments',
  '22830': 'Exploration of spinal fusion',
  '22840': 'Posterior non-segmental instrumentation (e.g., Harrington rod technique, pedicle fixation across one interspace)',
  '22841': 'Internal spinal fixation by wiring of spinous processes',
  '22842': 'Posterior segmental instrumentation (e.g., pedicle fixation, dual rods with multiple hooks/sublaminar wires); 3 to 6 vertebral segments',
  '22843': 'Posterior segmental instrumentation; 7 to 12 vertebral segments',
  '22844': 'Posterior segmental instrumentation; 13 or more vertebral segments',
  '22845': 'Anterior instrumentation; 2 to 3 vertebral segments',
  '22846': 'Anterior instrumentation; 4 to 7 vertebral segments',
  '22847': 'Anterior instrumentation; 8 or more vertebral segments',
  '22848': 'Pelvic fixation (attachment of instrumentation to pelvis), other than sacrum (add-on)',
  '22849': 'Reinsertion of spinal fixation device',
  '22850': 'Removal of posterior non-segmental instrumentation (e.g., Harrington rod)',
  '22852': 'Removal of posterior segmental instrumentation',
  '22853': 'Insertion of interbody biomechanical device(s) with integral anterior instrumentation for device anchoring; lumbar',
  '22854': 'Insertion of interbody biomechanical device(s) with integral anterior instrumentation for device anchoring; cervical',
  '22855': 'Removal of anterior instrumentation',
  '22856': 'Total disc arthroplasty (artificial disc); anterior approach, single interspace, cervical',
  '22857': 'Total disc arthroplasty (artificial disc); anterior approach, single interspace, lumbar',
  '22858': 'Total disc arthroplasty; second level, cervical (add-on)',
  '22859': 'Total disc arthroplasty; second level, lumbar (add-on)',
  '22861': 'Revision including replacement of total disc arthroplasty; anterior approach, single interspace; cervical',
  '22862': 'Revision including replacement of total disc arthroplasty; anterior approach, single interspace; lumbar',
  '22864': 'Removal of total disc arthroplasty; anterior approach, single interspace; cervical',
  '22865': 'Removal of total disc arthroplasty; anterior approach, single interspace; lumbar',
  '22867': 'Insertion of interlaminar/interspinous process stabilization/distraction device; without decompression, single level',
  '22868': 'Insertion of interlaminar/interspinous process stabilization/distraction device; with decompression, single level',
  '22869': 'Insertion of interlaminar/interspinous process stabilization/distraction device; additional level (add-on)',
  '22870': 'Insertion of interlaminar/interspinous process stabilization/distraction device; with decompression, additional level (add-on)',
  '22899': 'Unlisted procedure, spine',

  // Spine - Laminectomy/Decompression
  '63001': 'Laminectomy with exploration and/or decompression of spinal cord and/or cauda equina; cervical, without facetectomy, foraminotomy or discectomy',
  '63003': 'Laminectomy with exploration and/or decompression of spinal cord and/or cauda equina; thoracic, without facetectomy, foraminotomy or discectomy',
  '63005': 'Laminectomy with exploration and/or decompression of spinal cord and/or cauda equina; lumbar, except for spondylolisthesis, without facetectomy, foraminotomy or discectomy',
  '63011': 'Laminectomy with exploration and/or decompression of spinal cord and/or cauda equina; sacral, without facetectomy, foraminotomy or discectomy',
  '63012': 'Laminectomy with removal of abnormal facets and/or pars inter-articularis with decompression of cauda equina and nerve roots; lumbar, single vertebral segment',
  '63015': 'Laminectomy with exploration and/or decompression of spinal cord and/or cauda equina; cervical, with facetectomy, foraminotomy and/or discectomy, 1 or 2 segments',
  '63016': 'Laminectomy with exploration and/or decompression of spinal cord and/or cauda equina; cervical, with facetectomy, foraminotomy and/or discectomy, more than 2 segments',
  '63017': 'Laminectomy with exploration and/or decompression of spinal cord and/or cauda equina; lumbar, with facetectomy, foraminotomy and/or discectomy, more than 2 vertebral segments',
  '63020': 'Laminotomy (hemilaminectomy), with decompression of nerve root(s), including partial facetectomy, foraminotomy and/or excision of herniated intervertebral disc; cervical, 1 interspace',
  '63030': 'Laminotomy (hemilaminectomy), with decompression of nerve root(s), including partial facetectomy, foraminotomy and/or excision of herniated intervertebral disc; lumbar, 1 interspace',
  '63035': 'Laminotomy (hemilaminectomy), each additional interspace, cervical or lumbar (add-on)',
  '63040': 'Laminotomy (hemilaminectomy), with decompression of nerve root(s), including partial facetectomy, foraminotomy and/or excision of herniated intervertebral disc; reexploration, cervical, single interspace',
  '63042': 'Laminotomy (hemilaminectomy), with decompression of nerve root(s), including partial facetectomy, foraminotomy and/or excision of herniated intervertebral disc; reexploration, lumbar, single interspace',
  '63043': 'Laminotomy, each additional cervical interspace, reexploration (add-on)',
  '63044': 'Laminotomy, each additional lumbar interspace, reexploration (add-on)',
  '63045': 'Laminectomy, facetectomy and foraminotomy (unilateral or bilateral with decompression of spinal cord, cauda equina and/or nerve root(s)); cervical, single segment',
  '63046': 'Laminectomy, facetectomy and foraminotomy (unilateral or bilateral with decompression of spinal cord, cauda equina and/or nerve root(s)); thoracic, single segment',
  '63047': 'Laminectomy, facetectomy and foraminotomy (unilateral or bilateral with decompression of spinal cord, cauda equina and/or nerve root(s)); lumbar, single segment',
  '63048': 'Laminectomy, facetectomy and foraminotomy, each additional segment, cervical, thoracic, or lumbar (add-on)',
  '63050': 'Laminoplasty, cervical, with decompression of the spinal cord; 2 or more vertebral segments',
  '63051': 'Laminoplasty, cervical, with decompression of the spinal cord; with reconstruction of the posterior bony elements',
  '63055': 'Transpedicular approach with decompression of spinal cord, equina and/or nerve root(s); thoracic, single segment',
  '63056': 'Transpedicular approach with decompression of spinal cord, equina and/or nerve root(s); thoracic, each additional segment (add-on)',
  '63057': 'Transpedicular approach with decompression of spinal cord, equina and/or nerve root(s); lumbar, single segment',
  '63064': 'Costovertebral approach with decompression of spinal cord or nerve root(s); thoracic, single segment',
  '63066': 'Costovertebral approach with decompression of spinal cord or nerve root(s); thoracic, each additional segment (add-on)',
  '63075': 'Discectomy, anterior, with decompression of spinal cord and/or nerve root(s), including osteophytectomy; cervical, single interspace',
  '63076': 'Discectomy, anterior, with decompression of spinal cord and/or nerve root(s), including osteophytectomy; cervical, each additional interspace (add-on)',
  '63077': 'Discectomy, anterior, with decompression of spinal cord and/or nerve root(s), including osteophytectomy; thoracic, single interspace',
  '63078': 'Discectomy, anterior, with decompression of spinal cord and/or nerve root(s), including osteophytectomy; thoracic, each additional interspace (add-on)',
  '63081': 'Vertebral corpectomy (vertebral body resection), partial or complete; anterior approach, cervical, single segment',
  '63082': 'Vertebral corpectomy; anterior approach, cervical, each additional segment (add-on)',
  '63085': 'Vertebral corpectomy (vertebral body resection), partial or complete; anterior approach, thoracic, single segment',
  '63086': 'Vertebral corpectomy; anterior approach, thoracic, each additional segment (add-on)',
  '63087': 'Vertebral corpectomy (vertebral body resection), partial or complete; combined thoracolumbar, single segment',
  '63088': 'Vertebral corpectomy; combined thoracolumbar, each additional segment (add-on)',
  '63090': 'Vertebral corpectomy (vertebral body resection), partial or complete; transperitoneal or retroperitoneal approach, lumbar, single segment',
  '63091': 'Vertebral corpectomy; transperitoneal or retroperitoneal approach, lumbar, each additional segment (add-on)',
  '63101': 'Vertebral corpectomy, lateral extracavitary approach to lesion; thoracic, single segment',
  '63102': 'Vertebral corpectomy, lateral extracavitary approach; lumbar, single segment',
  '63103': 'Vertebral corpectomy, lateral extracavitary approach; thoracic or lumbar, each additional segment (add-on)',

  // Spine - Tumor/Lesion
  '63170': 'Laminectomy with myelotomy (Bischof or DREZ type procedure)',
  '63172': 'Laminectomy with drainage of intramedullary cyst/syrinx; to subarachnoid space',
  '63173': 'Laminectomy with drainage of intramedullary cyst/syrinx; to peritoneal or pleural space',
  '63180': 'Laminectomy and section of dentate ligaments, with or without dural graft; cervical',
  '63182': 'Laminectomy and section of dentate ligaments, with or without dural graft; thoracic',
  '63185': 'Laminectomy with rhizotomy; 1 or 2 segments',
  '63190': 'Laminectomy with rhizotomy; more than 2 segments',
  '63191': 'Laminectomy with section of spinal accessory nerve',
  '63194': 'Laminectomy with cordotomy, with section of 1 spinothalamic tract; cervical',
  '63195': 'Laminectomy with cordotomy, with section of 1 spinothalamic tract; thoracic',
  '63196': 'Laminectomy with cordotomy, with section of both spinothalamic tracts; cervical',
  '63197': 'Laminectomy with cordotomy, with section of both spinothalamic tracts; thoracic',
  '63198': 'Laminectomy with cordotomy, with section of both spinothalamic tracts; thoracic, 2 stages within 14 days',
  '63200': 'Laminectomy, with release of tethered spinal cord, lumbar',
  '63250': 'Laminectomy for excision or occlusion of arteriovenous malformation of spinal cord; cervical',
  '63251': 'Laminectomy for excision or occlusion of arteriovenous malformation of spinal cord; thoracic',
  '63252': 'Laminectomy for excision or occlusion of arteriovenous malformation of spinal cord; thoracolumbar',
  '63265': 'Laminectomy for excision or evacuation of intraspinal lesion other than neoplasm, extradural; cervical',
  '63266': 'Laminectomy for excision or evacuation of intraspinal lesion other than neoplasm, extradural; thoracic',
  '63267': 'Laminectomy for excision or evacuation of intraspinal lesion other than neoplasm, extradural; lumbar',
  '63268': 'Laminectomy for excision or evacuation of intraspinal lesion other than neoplasm, extradural; sacral',
  '63270': 'Laminectomy for excision of intraspinal lesion other than neoplasm, intradural; cervical',
  '63271': 'Laminectomy for excision of intraspinal lesion other than neoplasm, intradural; thoracic',
  '63272': 'Laminectomy for excision of intraspinal lesion other than neoplasm, intradural; lumbar',
  '63273': 'Laminectomy for excision of intraspinal lesion other than neoplasm, intradural; sacral',
  '63275': 'Laminectomy for biopsy/excision of intraspinal neoplasm; extradural, cervical',
  '63276': 'Laminectomy for biopsy/excision of intraspinal neoplasm; extradural, thoracic',
  '63277': 'Laminectomy for biopsy/excision of intraspinal neoplasm; extradural, lumbar',
  '63278': 'Laminectomy for biopsy/excision of intraspinal neoplasm; extradural, sacral',
  '63280': 'Laminectomy for biopsy/excision of intraspinal neoplasm; intradural, extramedullary, cervical',
  '63281': 'Laminectomy for biopsy/excision of intraspinal neoplasm; intradural, extramedullary, thoracic',
  '63282': 'Laminectomy for biopsy/excision of intraspinal neoplasm; intradural, extramedullary, lumbar',
  '63283': 'Laminectomy for biopsy/excision of intraspinal neoplasm; intradural, extramedullary, sacral',
  '63285': 'Laminectomy for biopsy/excision of intraspinal neoplasm; intradural, intramedullary, cervical',
  '63286': 'Laminectomy for biopsy/excision of intraspinal neoplasm; intradural, intramedullary, thoracic',
  '63287': 'Laminectomy for biopsy/excision of intraspinal neoplasm; intradural, intramedullary, thoracolumbar',
  '63290': 'Laminectomy for biopsy/excision of intraspinal neoplasm; combined extradural-intradural lesion, any level',
  '63295': 'Osteoplastic reconstruction of dorsal spinal elements following primary intraspinal procedure (add-on)',
  '63300': 'Vertebral corpectomy for excision of intraspinal lesion; single segment, extradural, cervical',
  '63301': 'Vertebral corpectomy for excision of intraspinal lesion; single segment, extradural, thoracic',
  '63302': 'Vertebral corpectomy for excision of intraspinal lesion; single segment, extradural, thoracolumbar',
  '63303': 'Vertebral corpectomy for excision of intraspinal lesion; single segment, extradural, lumbar or sacral',
  '63304': 'Vertebral corpectomy for excision of intraspinal lesion; single segment, intradural, cervical',
  '63305': 'Vertebral corpectomy for excision of intraspinal lesion; single segment, intradural, thoracic',
  '63306': 'Vertebral corpectomy for excision of intraspinal lesion; single segment, intradural, thoracolumbar',
  '63307': 'Vertebral corpectomy for excision of intraspinal lesion; single segment, intradural, lumbar or sacral',
  '63308': 'Vertebral corpectomy for excision of intraspinal lesion; each additional segment (add-on)',

  // Spinal Neurostimulator/Pump
  '63650': 'Percutaneous implantation of neurostimulator electrode array, epidural',
  '63655': 'Laminectomy for implantation of neurostimulator electrodes, plate/paddle, epidural',
  '63661': 'Removal of spinal neurostimulator electrode percutaneous array(s)',
  '63662': 'Removal of spinal neurostimulator electrode plate/paddle(s)',
  '63663': 'Revision including replacement of spinal neurostimulator electrode percutaneous array(s)',
  '63664': 'Revision including replacement of spinal neurostimulator electrode plate/paddle(s)',
  '63685': 'Insertion of spinal neurostimulator pulse generator or receiver',
  '63688': 'Revision or removal of implanted spinal neurostimulator pulse generator or receiver',

  // Peripheral Nerve
  '64400': 'Injection, anesthetic agent; trigeminal nerve, any division or branch',
  '64402': 'Injection, anesthetic agent; facial nerve',
  '64405': 'Injection, anesthetic agent; greater occipital nerve',
  '64408': 'Injection, anesthetic agent; vagus nerve',
  '64410': 'Injection, anesthetic agent; phrenic nerve',
  '64413': 'Injection, anesthetic agent; cervical plexus',
  '64415': 'Injection, anesthetic agent; brachial plexus, single',
  '64416': 'Injection, anesthetic agent; brachial plexus, continuous infusion',
  '64417': 'Injection, anesthetic agent; axillary nerve',
  '64418': 'Injection, anesthetic agent; suprascapular nerve',
  '64420': 'Injection, anesthetic agent; intercostal nerve, single',
  '64421': 'Injection, anesthetic agent; intercostal nerves, multiple, regional block',
  '64425': 'Injection, anesthetic agent; ilioinguinal, iliohypogastric nerves',
  '64430': 'Injection, anesthetic agent; pudendal nerve',
  '64435': 'Injection, anesthetic agent; paracervical (uterine) nerve',
  '64445': 'Injection, anesthetic agent; sciatic nerve, single',
  '64446': 'Injection, anesthetic agent; sciatic nerve, continuous infusion by catheter',
  '64447': 'Injection, anesthetic agent; femoral nerve, single',
  '64448': 'Injection, anesthetic agent; femoral nerve, continuous infusion by catheter',
  '64449': 'Injection, anesthetic agent; lumbar plexus, posterior approach, continuous infusion by catheter',
  '64450': 'Injection, anesthetic agent; other peripheral nerve or branch',
  '64455': 'Injection(s), anesthetic agent and/or steroid; plantar common digital nerve(s)',
  '64461': 'Paravertebral block (PVB); thoracic, single injection site',
  '64462': 'Paravertebral block (PVB); thoracic, second and any additional injection site(s)',
  '64463': 'Paravertebral block (PVB); thoracic, continuous infusion by catheter',
  '64479': 'Injection, anesthetic agent and/or steroid; transforaminal epidural, cervical or thoracic, single level',
  '64480': 'Injection, anesthetic agent and/or steroid; transforaminal epidural, cervical or thoracic, each additional level (add-on)',
  '64483': 'Injection, anesthetic agent and/or steroid; transforaminal epidural, lumbar or sacral, single level',
  '64484': 'Injection, anesthetic agent and/or steroid; transforaminal epidural, lumbar or sacral, each additional level (add-on)',
  '64486': 'Transversus abdominis plane (TAP) block; unilateral, by injection(s)',
  '64487': 'Transversus abdominis plane (TAP) block; bilateral, by injections',
  '64488': 'Transversus abdominis plane (TAP) block; unilateral, by continuous infusion(s)',
  '64489': 'Transversus abdominis plane (TAP) block; bilateral, by continuous infusions',
  '64490': 'Injection(s), diagnostic or therapeutic agent; paravertebral facet (zygapophyseal) joint; cervical or thoracic, single level',
  '64491': 'Injection(s), diagnostic or therapeutic agent; paravertebral facet (zygapophyseal) joint; cervical or thoracic, second level (add-on)',
  '64492': 'Injection(s), diagnostic or therapeutic agent; paravertebral facet (zygapophyseal) joint; cervical or thoracic, third and any additional level(s) (add-on)',
  '64493': 'Injection(s), diagnostic or therapeutic agent; paravertebral facet (zygapophyseal) joint; lumbar or sacral, single level',
  '64494': 'Injection(s), diagnostic or therapeutic agent; paravertebral facet (zygapophyseal) joint; lumbar or sacral, second level (add-on)',
  '64495': 'Injection(s), diagnostic or therapeutic agent; paravertebral facet (zygapophyseal) joint; lumbar or sacral, third and any additional level(s) (add-on)',
  '64505': 'Injection, anesthetic agent; sphenopalatine ganglion',
  '64508': 'Injection, anesthetic agent; carotid sinus (separate procedure)',
  '64510': 'Injection, anesthetic agent; stellate ganglion (cervical sympathetic)',
  '64517': 'Injection, anesthetic agent; superior hypogastric plexus',
  '64520': 'Injection, anesthetic agent; lumbar or thoracic (paravertebral sympathetic)',
  '64530': 'Injection, anesthetic agent; celiac plexus, with or without radiologic monitoring',
  '64550': 'Application of surface (transcutaneous) neurostimulator',
  '64553': 'Percutaneous implantation of neurostimulator electrodes; cranial nerve',
  '64555': 'Percutaneous implantation of neurostimulator electrodes; peripheral nerve (excludes sacral nerve)',
  '64561': 'Percutaneous implantation of neurostimulator electrodes; sacral nerve (transforaminal placement)',
  '64566': 'Posterior tibial neurostimulation, percutaneous needle electrode, single treatment',
  '64568': 'Open implantation of cranial nerve (e.g., vagus nerve) neurostimulator electrode array and pulse generator',
  '64569': 'Revision or replacement of cranial nerve (e.g., vagus nerve) neurostimulator electrode array',
  '64570': 'Removal of cranial nerve (e.g., vagus nerve) neurostimulator electrode array and pulse generator',
  '64575': 'Open implantation of neurostimulator electrode array; peripheral nerve (excludes sacral nerve)',
  '64580': 'Open implantation of neurostimulator electrode array; neuromuscular',
  '64581': 'Open implantation of neurostimulator electrode array; sacral nerve (transforaminal placement)',
  '64585': 'Revision or removal of peripheral neurostimulator electrode array',
  '64590': 'Insertion or replacement of peripheral or gastric neurostimulator pulse generator or receiver',
  '64595': 'Revision or removal of peripheral or gastric neurostimulator pulse generator or receiver',
  '64600': 'Destruction by neurolytic agent, trigeminal nerve; supraorbital, infraorbital, mental, or inferior alveolar branch',
  '64605': 'Destruction by neurolytic agent, trigeminal nerve; second and third division branches at foramen ovale',
  '64610': 'Destruction by neurolytic agent, trigeminal nerve; second and third division branches at foramen ovale under radiologic monitoring',
  '64612': 'Chemodenervation of muscle(s); muscle(s) innervated by facial nerve, unilateral',
  '64615': 'Chemodenervation of muscle(s); muscle(s) innervated by facial, trigeminal, cervical spinal and accessory nerves, bilateral',
  '64616': 'Chemodenervation of muscle(s); neck muscle(s), excluding muscles of the larynx, unilateral',
  '64617': 'Chemodenervation of muscle(s); larynx, unilateral, percutaneous',
  '64620': 'Destruction by neurolytic agent, intercostal nerve',
  '64624': 'Destruction by neurolytic agent, genicular nerve branches',
  '64625': 'Radiofrequency ablation, nerves innervating the sacroiliac joint',
  '64630': 'Destruction by neurolytic agent; pudendal nerve',
  '64632': 'Destruction by neurolytic agent; plantar common digital nerve',
  '64633': 'Destruction by neurolytic agent, paravertebral facet joint nerve(s); cervical or thoracic, single facet joint',
  '64634': 'Destruction by neurolytic agent, paravertebral facet joint nerve(s); cervical or thoracic, each additional facet joint (add-on)',
  '64635': 'Destruction by neurolytic agent, paravertebral facet joint nerve(s); lumbar or sacral, single facet joint',
  '64636': 'Destruction by neurolytic agent, paravertebral facet joint nerve(s); lumbar or sacral, each additional facet joint (add-on)',
  '64640': 'Destruction by neurolytic agent; other peripheral nerve or branch',
  '64642': 'Chemodenervation of one extremity; 1 to 4 muscle(s)',
  '64643': 'Chemodenervation of one extremity; each additional extremity, 1 to 4 muscle(s) (add-on)',
  '64644': 'Chemodenervation of one extremity; 5 or more muscles',
  '64645': 'Chemodenervation of one extremity; each additional extremity, 5 or more muscles (add-on)',
  '64646': 'Chemodenervation of trunk muscle(s); 1 to 5 muscle(s)',
  '64647': 'Chemodenervation of trunk muscle(s); 6 or more muscles',
  '64650': 'Chemodenervation of eccrine glands; both axillae',
  '64653': 'Chemodenervation of eccrine glands; other area(s) per day',
  '64680': 'Destruction by neurolytic agent, celiac plexus, with or without radiologic monitoring',
  '64681': 'Destruction by neurolytic agent, superior hypogastric plexus, with or without radiologic monitoring',
  '64702': 'Neuroplasty; digital, 1 or both, same digit',
  '64704': 'Neuroplasty; nerve of hand or foot',
  '64708': 'Neuroplasty, major peripheral nerve, arm or leg; open',
  '64712': 'Neuroplasty, major peripheral nerve, arm or leg; open, each additional nerve (add-on)',
  '64713': 'Neuroplasty, major peripheral nerve, arm or leg; open, each additional nerve (add-on)',
  '64714': 'Neuroplasty, major peripheral nerve, arm or leg; open, each additional nerve (add-on)',
  '64716': 'Neuroplasty and/or transposition; cranial nerve (specify)',
  '64718': 'Neuroplasty and/or transposition; ulnar nerve at elbow',
  '64719': 'Neuroplasty and/or transposition; ulnar nerve at wrist',
  '64721': 'Neuroplasty and/or transposition; median nerve at carpal tunnel (carpal tunnel release)',
  '64722': 'Decompression; unspecified nerve(s) (specify)',
  '64726': 'Decompression; plantar digital nerve',
  '64727': 'Internal neurolysis, requiring use of operating microscope (add-on)',
  '64732': 'Transection or avulsion of; supraorbital nerve',
  '64734': 'Transection or avulsion of; infraorbital nerve',
  '64736': 'Transection or avulsion of; mental nerve',
  '64738': 'Transection or avulsion of; inferior alveolar nerve by osteotomy',
  '64740': 'Transection or avulsion of; lingual nerve',
  '64742': 'Transection or avulsion of; facial nerve, differential or complete',
  '64744': 'Transection or avulsion of; greater occipital nerve',
  '64746': 'Transection or avulsion of; phrenic nerve',
  '64755': 'Transection or avulsion of; vagus nerves limited to proximal stomach',
  '64760': 'Transection or avulsion of; vagus nerve (vagotomy), abdominal',
  '64763': 'Transection or avulsion of obturator nerve, extrapelvic, with or without adductor tenotomy',
  '64766': 'Transection or avulsion of obturator nerve, intrapelvic, with or without adductor tenotomy',
  '64771': 'Transection or avulsion of other cranial nerve, extradural',
  '64772': 'Transection or avulsion of other spinal nerve, extradural',
  '64774': 'Excision of neuroma; cutaneous nerve, surgically identifiable',
  '64776': 'Excision of neuroma; digital nerve, 1 or both, same digit',
  '64778': 'Excision of neuroma; digital nerve, each additional digit (add-on)',
  '64782': 'Excision of neuroma; hand or foot, except digital nerve',
  '64783': 'Excision of neuroma; hand or foot, each additional nerve, except same digit (add-on)',
  '64784': 'Excision of neuroma; major peripheral nerve, except sciatic',
  '64786': 'Excision of neuroma; sciatic nerve',
  '64787': 'Implantation of nerve end into bone or muscle (add-on)',
  '64788': 'Excision of neurofibroma or neurolemmoma; cutaneous nerve',
  '64790': 'Excision of neurofibroma or neurolemmoma; major peripheral nerve',
  '64792': 'Excision of neurofibroma or neurolemmoma; extensive (including malignant type)',
  '64795': 'Biopsy of nerve',
  '64802': 'Sympathectomy, cervical',
  '64804': 'Sympathectomy, cervicothoracic',
  '64809': 'Sympathectomy, thoracolumbar',
  '64818': 'Sympathectomy, lumbar',
  '64820': 'Sympathectomy; digital arteries, each digit',
  '64821': 'Sympathectomy; radial artery',
  '64822': 'Sympathectomy; ulnar artery',
  '64823': 'Sympathectomy; superficial palmar arch',
  '64831': 'Suture of digital nerve, hand or foot; 1 nerve',
  '64832': 'Suture of digital nerve, hand or foot; each additional digital nerve (add-on)',
  '64834': 'Suture of 1 nerve; hand or foot, common sensory nerve',
  '64835': 'Suture of 1 nerve; median motor thenar',
  '64836': 'Suture of 1 nerve; ulnar motor',
  '64837': 'Suture of each additional nerve, hand or foot (add-on)',
  '64840': 'Suture of posterior tibial nerve',
  '64856': 'Suture of major peripheral nerve, arm or leg, except sciatic; including transposition',
  '64857': 'Suture of major peripheral nerve, arm or leg, except sciatic; without transposition',
  '64858': 'Suture of sciatic nerve',
  '64859': 'Suture of each additional major peripheral nerve (add-on)',
  '64861': 'Suture of; brachial plexus',
  '64862': 'Suture of; lumbar plexus',
  '64864': 'Suture of facial nerve; extracranial',
  '64865': 'Suture of facial nerve; infratemporal, with or without grafting',
  '64866': 'Anastomosis; facial-spinal accessory',
  '64868': 'Anastomosis; facial-hypoglossal',
  '64872': 'Suture of nerve; requiring secondary or delayed suture (add-on)',
  '64874': 'Suture of nerve; requiring extensive mobilization, or transposition of nerve (add-on)',
  '64876': 'Suture of nerve; requiring shortening of bone of extremity (add-on)',
  '64885': 'Nerve graft (includes obtaining graft), head or neck; up to 4 cm in length',
  '64886': 'Nerve graft (includes obtaining graft), head or neck; more than 4 cm in length',
  '64890': 'Nerve graft (includes obtaining graft), single strand, hand or foot; up to 4 cm in length',
  '64891': 'Nerve graft (includes obtaining graft), single strand, hand or foot; more than 4 cm in length',
  '64892': 'Nerve graft (includes obtaining graft), single strand, arm or leg; up to 4 cm in length',
  '64893': 'Nerve graft (includes obtaining graft), single strand, arm or leg; more than 4 cm in length',
  '64895': 'Nerve graft (includes obtaining graft), multiple strands (cable), hand or foot; up to 4 cm in length',
  '64896': 'Nerve graft (includes obtaining graft), multiple strands (cable), hand or foot; more than 4 cm in length',
  '64897': 'Nerve graft (includes obtaining graft), multiple strands (cable), arm or leg; up to 4 cm in length',
  '64898': 'Nerve graft (includes obtaining graft), multiple strands (cable), arm or leg; more than 4 cm in length',
  '64901': 'Nerve graft, each additional nerve; single strand (add-on)',
  '64902': 'Nerve graft, each additional nerve; multiple strands (cable) (add-on)',
  '64905': 'Nerve pedicle transfer; first stage',
  '64907': 'Nerve pedicle transfer; second stage',
  '64910': 'Nerve repair; with synthetic conduit or vein allograft (eg, nerve tube), each nerve',
  '64911': 'Nerve repair; with autogenous vein graft (includes harvest of vein graft), each nerve',
  '64912': 'Nerve repair; with nerve allograft, first strand (cable)',
  '64913': 'Nerve repair; with nerve allograft, each additional strand (add-on)',
  '64999': 'Unlisted procedure, nervous system'
};

function getCptDescription(code) {
  if (!code) return '';
  const cleanCode = code.toString().trim();
  return CPT_DESCRIPTIONS[cleanCode] || '';
}

// --------------------------------------------
// Loading Messages (rotating during processing)
// --------------------------------------------
const LOADING_MESSAGES = [
  'Analyzing image content...',
  'Extracting procedure details...',
  'Identifying patient information...',
  'Reading surgical data...',
  'Processing case information...',
  'Parsing clinical details...',
  'Recognizing text from image...',
  'Matching CPT codes...',
  'Categorizing procedure type...',
  'Cross-referencing case data...',
  'Validating extracted fields...',
  'Almost there...'
];

let loadingInterval = null;
let currentMessageIndex = 0;

function startLoadingMessages(textElement) {
  currentMessageIndex = 0;
  textElement.textContent = LOADING_MESSAGES[0];

  loadingInterval = setInterval(() => {
    currentMessageIndex = (currentMessageIndex + 1) % LOADING_MESSAGES.length;
    textElement.textContent = LOADING_MESSAGES[currentMessageIndex];
  }, 8000); // Change message every 8 seconds
}

function stopLoadingMessages() {
  if (loadingInterval) {
    clearInterval(loadingInterval);
    loadingInterval = null;
  }
}

// --------------------------------------------
// Edit Mode Tracking
// --------------------------------------------
let editingCaseId = null;  // null = new case, number = editing existing case

// --------------------------------------------
// Tab Navigation
// --------------------------------------------
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    // Add active class to clicked tab and corresponding content
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');

    // Load cases when switching to cases tab
    if (tab.dataset.tab === 'cases') {
      loadCases();
    }

    // Load table when switching to table tab
    if (tab.dataset.tab === 'table') {
      loadCasesTable();
    }
    // Load follow-up queue
    if (tab.dataset.tab === 'followup') {
      loadFollowUpQueue();
    }
    // Load stats when switching to stats tab
    if (tab.dataset.tab === 'stats') {
      loadStats();
    }
  });
});

// Table sorting state
let tableSortField = 'date_of_surgery';
let tableSortAsc = false; // Default to descending (newest first)
let tableCasesCache = [];
let tableObserver = null;
const tableRenderState = {
  all: [],
  offset: 0,
  pageSize: 60
};
const tableFilters = {
  attending: '',
  category: '',
  startDate: '',
  endDate: '',
  status: '',
  followUp: ''
};

const tableFilterAttending = document.getElementById('tableFilterAttending');
const tableFilterCategory = document.getElementById('tableFilterCategory');
const tableFilterStartDate = document.getElementById('tableFilterStartDate');
const tableFilterEndDate = document.getElementById('tableFilterEndDate');
const tableFilterStatus = document.getElementById('tableFilterStatus');
const tableFilterFollowUp = document.getElementById('tableFilterFollowUp');
const clearTableFilters = document.getElementById('clearTableFilters');
const tableSentinel = document.getElementById('tableSentinel');

// Load cases into the table view
async function loadCasesTable() {
  try {
    const response = await fetch('/api/cases');
    const cases = await response.json();
    tableCasesCache = cases;
    updateSelectOptions(tableFilterAttending, cases.map(c => c.attending_surgeon), 'All');
    updateSelectOptions(tableFilterCategory, cases.map(c => c.case_category), 'All');
    renderCasesTable(tableCasesCache);
  } catch (error) {
    console.error('Error loading table:', error);
  }
}

function renderCasesTable(cases) {
  const filtered = filterCasesByCriteria(cases, tableFilters);
  const sorted = sortCases(filtered, tableSortField, tableSortAsc);

  updateSortIcons();

  const tbody = document.getElementById('casesTableBody');
  tbody.innerHTML = '';
  tableRenderState.all = sorted;
  tableRenderState.offset = 0;

  if (sorted.length === 0) {
    const emptyMessage = hasActiveFilters(tableFilters)
      ? 'No cases match current filters.'
      : 'No cases yet. Upload some images to get started.';
    tbody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: #666;">${emptyMessage}</td></tr>`;
    const selectAll = document.getElementById('selectAllTable');
    if (selectAll) {
      selectAll.checked = false;
      selectAll.indeterminate = false;
    }
    updateTableSelection();
    if (tableSentinel) {
      tableSentinel.classList.add('hidden');
    }
    return;
  }

  renderNextTablePage();
  ensureTableObserver();

  if (tableSentinel) {
    tableSentinel.textContent = 'Loading more...';
    tableSentinel.classList.toggle('hidden', tableRenderState.offset >= tableRenderState.all.length);
  }

  const selectAll = document.getElementById('selectAllTable');
  if (selectAll) {
    selectAll.checked = false;
    selectAll.indeterminate = false;
  }
  updateTableSelection();
}

function renderTableRow(c) {
  // Use cpt_inferred_note first (from DB), fall back to CPT reference
  const cptDesc = c.cpt_inferred_note || (c.cpt_code ? CPT_DESCRIPTIONS[c.cpt_code] : '') || '';
  const cptDisplay = cptDesc ? `${truncate(cptDesc, 30)} (${c.cpt_code})` : (c.cpt_code || '-');
  const cptTitle = cptDesc ? `${cptDesc} (${c.cpt_code})` : '';
  return `
      <tr data-id="${c.id}">
        <td style="text-align: center;">
          <input type="checkbox" class="table-select-checkbox" data-id="${c.id}" onchange="updateTableSelection()">
        </td>
        <td>${c.date_of_surgery || '-'}</td>
        <td>${c.patient_mrn || '-'}</td>
        <td class="truncate-cell" title="${escapeHtml(c.procedure_name) || ''}">${truncate(c.procedure_name, 35) || '-'}</td>
        <td class="truncate-cell" title="${escapeHtml(cptTitle)}">${cptDisplay}</td>
        <td class="truncate-cell" title="${escapeHtml(c.attending_surgeon) || ''}">${truncate(c.attending_surgeon, 20) || '-'}</td>
        <td class="truncate-cell" title="${escapeHtml(c.case_category) || ''}">${truncate(c.case_category, 20) || '-'}</td>
        <td style="text-align: center;">
          <span class="img-badge ${c.image_count > 0 ? 'has-images' : 'no-images'}"
                onclick="openAttachmentModal(${c.id})"
                title="${c.image_count > 0 ? 'View/add attachments' : 'Add attachments'}">
            ${c.image_count > 0 ? `📎${c.image_count}` : '+'}
          </span>
        </td>
        <td style="text-align: center;">
          ${c.follow_up_status && c.follow_up_status !== 'none' ? `
          <span class="followup-badge small ${c.follow_up_status} ${isFollowUpDue(c) ? 'due' : ''}">
            ${c.follow_up_status === 'done' ? 'Done' : isFollowUpDue(c) ? 'Past Due' : 'Scheduled'}
          </span>` : '-'}
        </td>
        <td style="text-align: center;">
          <span class="acgme-badge ${c.submitted_to_acgme ? 'submitted' : 'pending'}"
                onclick="toggleAcgmeStatus(${c.id}, ${c.submitted_to_acgme ? 'true' : 'false'}); loadCasesTable();"
                title="Click to toggle">
            ${c.submitted_to_acgme ? '✓' : '○'}
          </span>
        </td>
        <td>
          <button class="btn-table-edit" onclick="editCase(${c.id})">Edit</button>
        </td>
      </tr>
  `;
}

function renderNextTablePage() {
  const tbody = document.getElementById('casesTableBody');
  const start = tableRenderState.offset;
  const end = Math.min(start + tableRenderState.pageSize, tableRenderState.all.length);
  const slice = tableRenderState.all.slice(start, end);

  if (slice.length > 0) {
    tbody.insertAdjacentHTML('beforeend', slice.map(renderTableRow).join(''));
  }

  tableRenderState.offset = end;
  if (tableSentinel) {
    tableSentinel.classList.toggle('hidden', tableRenderState.offset >= tableRenderState.all.length);
  }
}

function ensureTableObserver() {
  if (tableObserver || !tableSentinel) return;
  tableObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && tableRenderState.offset < tableRenderState.all.length) {
        renderNextTablePage();
        updateTableSelection();
      }
    });
  }, { rootMargin: '200px' });
  tableObserver.observe(tableSentinel);
}

// Sort cases by field
function sortCases(cases, field, ascending) {
  return [...cases].sort((a, b) => {
    if (field === 'date_of_surgery') {
      const dateA = parseCaseDateTime(a.date_of_surgery) || parseCaseDateTime(a.created_at);
      const dateB = parseCaseDateTime(b.date_of_surgery) || parseCaseDateTime(b.created_at);
      const timeA = dateA ? dateA.getTime() : 0;
      const timeB = dateB ? dateB.getTime() : 0;
      if (timeA !== timeB) return ascending ? timeA - timeB : timeB - timeA;
      return (a.id || 0) - (b.id || 0);
    }

    let valA = a[field] || '';
    let valB = b[field] || '';

    // Handle boolean for ACGME status
    if (field === 'submitted_to_acgme') {
      valA = valA ? 1 : 0;
      valB = valB ? 1 : 0;
    }

    // Handle numeric for image_count
    if (field === 'image_count') {
      valA = parseInt(valA) || 0;
      valB = parseInt(valB) || 0;
    }

    // String comparison (case-insensitive)
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return ascending ? -1 : 1;
    if (valA > valB) return ascending ? 1 : -1;
    return 0;
  });
}

// Update sort icons in table headers
function updateSortIcons() {
  document.querySelectorAll('#casesTable th.sortable').forEach(th => {
    const icon = th.querySelector('.sort-icon');
    if (th.dataset.sort === tableSortField) {
      icon.textContent = tableSortAsc ? '▲' : '▼';
      th.classList.add('sorted');
    } else {
      icon.textContent = '';
      th.classList.remove('sorted');
    }
  });
}

// Handle header click for sorting
document.querySelectorAll('#casesTable th.sortable').forEach(th => {
  th.addEventListener('click', () => {
    const field = th.dataset.sort;
    if (tableSortField === field) {
      // Toggle direction
      tableSortAsc = !tableSortAsc;
    } else {
      // New field, default to descending for dates, ascending for others
      tableSortField = field;
      tableSortAsc = field !== 'date_of_surgery';
    }
    loadCasesTable();
  });
});

tableFilterAttending?.addEventListener('change', () => {
  tableFilters.attending = normalizeSelectValue(tableFilterAttending.value);
  renderCasesTable(tableCasesCache);
});

tableFilterCategory?.addEventListener('change', () => {
  tableFilters.category = normalizeSelectValue(tableFilterCategory.value);
  renderCasesTable(tableCasesCache);
});

tableFilterStartDate?.addEventListener('change', () => {
  tableFilters.startDate = tableFilterStartDate.value || '';
  renderCasesTable(tableCasesCache);
});

tableFilterEndDate?.addEventListener('change', () => {
  tableFilters.endDate = tableFilterEndDate.value || '';
  renderCasesTable(tableCasesCache);
});

tableFilterStatus?.addEventListener('change', () => {
  tableFilters.status = normalizeSelectValue(tableFilterStatus.value);
  renderCasesTable(tableCasesCache);
});

tableFilterFollowUp?.addEventListener('change', () => {
  tableFilters.followUp = normalizeSelectValue(tableFilterFollowUp.value);
  renderCasesTable(tableCasesCache);
});

clearTableFilters?.addEventListener('click', () => {
  tableFilters.attending = '';
  tableFilters.category = '';
  tableFilters.startDate = '';
  tableFilters.endDate = '';
  tableFilters.status = '';
  tableFilters.followUp = '';
  if (tableFilterAttending) tableFilterAttending.value = '';
  if (tableFilterCategory) tableFilterCategory.value = '';
  if (tableFilterStartDate) tableFilterStartDate.value = '';
  if (tableFilterEndDate) tableFilterEndDate.value = '';
  if (tableFilterStatus) tableFilterStatus.value = '';
  if (tableFilterFollowUp) tableFilterFollowUp.value = '';
  renderCasesTable(tableCasesCache);
});

// Table selection functions
function toggleSelectAllTable() {
  const selectAll = document.getElementById('selectAllTable');
  const checkboxes = document.querySelectorAll('.table-select-checkbox');
  checkboxes.forEach(cb => cb.checked = selectAll.checked);
  updateTableSelection();
}

function updateTableSelection() {
  const checkboxes = document.querySelectorAll('.table-select-checkbox:checked');
  const count = checkboxes.length;
  const actionsDiv = document.getElementById('tableActions');
  const countSpan = document.getElementById('tableSelectionCount');

  if (count > 0) {
    actionsDiv.classList.remove('hidden');
    countSpan.textContent = `${count} selected`;
  } else {
    actionsDiv.classList.add('hidden');
  }

  // Update select all checkbox state
  const allCheckboxes = document.querySelectorAll('.table-select-checkbox');
  const selectAll = document.getElementById('selectAllTable');
  if (selectAll) {
    selectAll.checked = allCheckboxes.length > 0 && checkboxes.length === allCheckboxes.length;
    selectAll.indeterminate = checkboxes.length > 0 && checkboxes.length < allCheckboxes.length;
  }
}

async function deleteSelectedCases() {
  const checkboxes = document.querySelectorAll('.table-select-checkbox:checked');
  const ids = Array.from(checkboxes).map(cb => cb.dataset.id);

  if (ids.length === 0) return;

  const confirmMsg = `Delete ${ids.length} case${ids.length > 1 ? 's' : ''}?\n\nThis cannot be undone.`;
  if (!confirm(confirmMsg)) return;

  let deleted = 0;
  let errors = 0;

  for (const id of ids) {
    try {
      const response = await fetch(`/api/cases/${id}`, { method: 'DELETE' });
      if (response.ok) {
        deleted++;
      } else {
        errors++;
      }
    } catch (e) {
      errors++;
    }
  }

  if (errors > 0) {
    alert(`Deleted ${deleted} case(s). ${errors} error(s) occurred.`);
  }

  // Refresh table
  loadCasesTable();

  // Reset select all
  const selectAll = document.getElementById('selectAllTable');
  if (selectAll) selectAll.checked = false;
}

// Load stats view
async function loadStats() {
  try {
    const response = await fetch('/api/cases');
    const cases = await response.json();
    const statsStartDate = document.getElementById('statsStartDate');
    const statsEndDate = document.getElementById('statsEndDate');
    const statsFilterSummary = document.getElementById('statsFilterSummary');

    const startValue = statsStartDate?.value || '';
    const endValue = statsEndDate?.value || '';
    let filteredCases = cases;

    if (startValue || endValue) {
      const dateFiltered = filterCasesByDateRange(cases, startValue, endValue);
      filteredCases = dateFiltered.filtered;
      if (statsFilterSummary) {
        statsFilterSummary.textContent = `Showing ${filteredCases.length} of ${cases.length} cases`;
      }
    } else if (statsFilterSummary) {
      statsFilterSummary.textContent = '';
    }

    const total = filteredCases.length;
    const submitted = filteredCases.filter(c => c.submitted_to_acgme).length;
    const pending = total - submitted;
    const durations = filteredCases.filter(c => c.case_duration).map(c => parseInt(c.case_duration) || 0);
    const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

    // Update overview stats
    document.getElementById('statTotal').textContent = total;
    document.getElementById('statSubmitted').textContent = submitted;
    document.getElementById('statPending').textContent = pending;
    document.getElementById('statAvgDuration').textContent = avgDuration;

    // By Category
    renderBreakdown('statsByCategory', groupBy(filteredCases, 'case_category'), total);

    // By Attending
    renderBreakdown('statsByAttending', groupBy(filteredCases, 'attending_surgeon'), total);

    // By CPT Code with avg duration
    renderCptBreakdown('statsByCpt', filteredCases);

    // Monthly Trends
    renderMonthlyTrends('statsByMonth', filteredCases);

  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

function parseCaseDateTime(dateStr) {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  const dateOnly = trimmed.split(' ')[0];

  if (dateOnly.includes('-')) {
    const parts = dateOnly.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts.map(Number);
      if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
        return new Date(year, month - 1, day);
      }
    }
  }
  if (dateOnly.includes('/')) {
    const parts = dateOnly.split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts.map(Number);
      if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
        return new Date(year, month - 1, day);
      }
    }
  }
  return null;
}

function filterCasesByDateRange(cases, startValue, endValue) {
  let start = startValue ? new Date(startValue) : null;
  let end = endValue ? new Date(endValue) : null;

  if (start && end && start > end) {
    const temp = start;
    start = end;
    end = temp;
  }

  const filtered = cases.filter(c => {
    const caseDate = parseCaseDateTime(c.date_of_surgery);
    if (!caseDate) return false;
    if (start && caseDate < start) return false;
    if (end && caseDate > end) return false;
    return true;
  });

  return { filtered, start, end };
}

const statsStartDateInput = document.getElementById('statsStartDate');
const statsEndDateInput = document.getElementById('statsEndDate');
const clearStatsDates = document.getElementById('clearStatsDates');

function refreshStatsIfActive() {
  const statsTab = document.getElementById('stats');
  if (statsTab && statsTab.classList.contains('active')) {
    loadStats();
  }
}

statsStartDateInput?.addEventListener('change', refreshStatsIfActive);
statsEndDateInput?.addEventListener('change', refreshStatsIfActive);
clearStatsDates?.addEventListener('click', () => {
  if (statsStartDateInput) statsStartDateInput.value = '';
  if (statsEndDateInput) statsEndDateInput.value = '';
  refreshStatsIfActive();
});

// Group cases by a field
function groupBy(cases, field) {
  const groups = {};
  cases.forEach(c => {
    const key = c[field] || 'Unknown';
    groups[key] = (groups[key] || 0) + 1;
  });
  return Object.entries(groups).sort((a, b) => b[1] - a[1]);
}

// Render monthly trends as a line graph
function renderMonthlyTrends(containerId, cases) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Group cases by month (YYYY-MM)
  const monthlyData = {};
  cases.forEach(c => {
    if (c.date_of_surgery) {
      // Parse date - handle both YYYY-MM-DD and MM/DD/YYYY formats
      let dateStr = c.date_of_surgery;
      let month;
      if (dateStr.includes('-')) {
        // YYYY-MM-DD format
        month = dateStr.substring(0, 7); // YYYY-MM
      } else if (dateStr.includes('/')) {
        // MM/DD/YYYY format
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          month = `${parts[2]}-${parts[0].padStart(2, '0')}`;
        }
      }
      if (month) {
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      }
    }
  });

  // Sort by month (entire residency)
  const sortedMonths = Object.entries(monthlyData)
    .sort((a, b) => a[0].localeCompare(b[0]));

  if (sortedMonths.length === 0) {
    container.innerHTML = '<p style="color: #666; text-align: center;">No data</p>';
    return;
  }

  const maxCount = Math.max(...sortedMonths.map(m => m[1]));
  const minCount = 0;

  // Format month labels - show quarter labels (Q1'22, Q2'22, etc.)
  const formatMonthShort = (yyyymm) => {
    const [year, month] = yyyymm.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} '${year.slice(2)}`;
  };

  // Build SVG line graph with proper dimensions
  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const points = sortedMonths.map(([month, count], i) => {
    const x = padding.left + (i / (sortedMonths.length - 1 || 1)) * graphWidth;
    const y = padding.top + graphHeight - ((count - minCount) / (maxCount - minCount || 1)) * graphHeight;
    return { x, y, month, count };
  });

  // Create smooth path for line (using curve)
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Create area path (filled below line)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + graphHeight} L ${padding.left} ${padding.top + graphHeight} Z`;

  // X-axis labels - show Jan of each year plus first/last
  const yearStarts = points.filter((p, i) => {
    const month = p.month.split('-')[1];
    return month === '01' || i === 0 || i === points.length - 1;
  });
  // Limit to reasonable number of labels
  const xLabels = yearStarts.length > 8
    ? yearStarts.filter((_, i) => i % 2 === 0 || i === yearStarts.length - 1)
    : yearStarts;

  // Y-axis labels - nice round numbers
  const yLabels = [0, Math.round(maxCount / 2), maxCount];

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" class="trends-chart">
      <!-- Grid lines -->
      ${yLabels.map(val => {
        const y = padding.top + graphHeight - ((val - minCount) / (maxCount - minCount || 1)) * graphHeight;
        return `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#e5e7eb" stroke-width="1"/>`;
      }).join('')}

      <!-- Area fill -->
      <path d="${areaPath}" fill="var(--green-100)" opacity="0.6"/>

      <!-- Line -->
      <path d="${linePath}" fill="none" stroke="var(--green-600)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>

      <!-- Data points (only show hover targets, smaller visible dots) -->
      ${points.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="4" fill="var(--green-600)" opacity="0">
          <title>${formatMonthShort(p.month)}: ${p.count} cases</title>
        </circle>
        <circle cx="${p.x}" cy="${p.y}" r="2" fill="var(--green-600)" pointer-events="none"/>
      `).join('')}

      <!-- Y-axis labels -->
      ${yLabels.map(val => {
        const y = padding.top + graphHeight - ((val - minCount) / (maxCount - minCount || 1)) * graphHeight;
        return `<text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" font-size="12" fill="#6b7280" font-family="system-ui, sans-serif">${val}</text>`;
      }).join('')}

      <!-- X-axis labels -->
      ${xLabels.map(p => `<text x="${p.x}" y="${height - 12}" text-anchor="middle" font-size="11" fill="#6b7280" font-family="system-ui, sans-serif">${formatMonthShort(p.month)}</text>`).join('')}
    </svg>
    <div class="trends-summary">
      <span>Total: ${cases.length} cases</span>
      <span>Avg: ${Math.round(cases.length / sortedMonths.length)}/mo</span>
    </div>
  `;
}

// Render a breakdown section
function renderBreakdown(containerId, data, total) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (data.length === 0) {
    container.innerHTML = '<div class="breakdown-row"><span class="breakdown-label">No data</span></div>';
    return;
  }

  const maxCount = data[0][1];
  container.innerHTML = data.map(([label, count]) => `
    <div class="breakdown-row">
      <span class="breakdown-label">${label}</span>
      <div class="breakdown-bar">
        <div class="breakdown-bar-fill" style="width: ${(count / maxCount) * 100}%"></div>
      </div>
      <span class="breakdown-value">${count}</span>
    </div>
  `).join('');
}

// Render CPT breakdown with average duration
function renderCptBreakdown(containerId, cases) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cptData = {};
  cases.forEach(c => {
    if (c.cpt_code) {
      if (!cptData[c.cpt_code]) {
        // Use cpt_inferred_note from case, fall back to our CPT reference
        const desc = c.cpt_inferred_note || CPT_DESCRIPTIONS[c.cpt_code] || '';
        cptData[c.cpt_code] = { count: 0, durations: [], description: desc };
      } else if (!cptData[c.cpt_code].description && c.cpt_inferred_note) {
        // If we don't have a description yet but this case has one, use it
        cptData[c.cpt_code].description = c.cpt_inferred_note;
      }
      cptData[c.cpt_code].count++;
      if (c.case_duration) {
        cptData[c.cpt_code].durations.push(parseInt(c.case_duration) || 0);
      }
    }
  });

  const data = Object.entries(cptData)
    .map(([code, info]) => ({
      code,
      count: info.count,
      avgDuration: info.durations.length > 0 ? Math.round(info.durations.reduce((a, b) => a + b, 0) / info.durations.length) : null,
      description: info.description
    }))
    .sort((a, b) => b.count - a.count);

  if (data.length === 0) {
    container.innerHTML = '<div class="breakdown-row"><span class="breakdown-label">No data</span></div>';
    return;
  }

  const maxCount = data[0].count;
  container.innerHTML = data.map(item => {
    const displayLabel = item.description ? `${item.description} (${item.code})` : item.code;
    return `
    <div class="breakdown-row">
      <span class="breakdown-label">${displayLabel}</span>
      <div class="breakdown-bar">
        <div class="breakdown-bar-fill" style="width: ${(item.count / maxCount) * 100}%"></div>
      </div>
      <span class="breakdown-value">${item.count}</span>
      <span class="breakdown-meta">${item.avgDuration ? `${item.avgDuration}m avg` : ''}</span>
    </div>
  `}).join('');
}

// Escape HTML for safe tooltip display
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Truncate text with ellipsis
function truncate(str, maxLen) {
  if (!str) return '';
  return str.length > maxLen ? str.substring(0, maxLen) + '...' : str;
}

// --------------------------------------------
// Image Resizing (for faster uploads & lower API costs)
// --------------------------------------------
const MAX_IMAGE_DIMENSION = 1600;  // Max width or height in pixels
const JPEG_QUALITY = 0.85;         // Quality for JPEG compression (0-1)

// Resize an image file and return a new smaller blob
async function resizeImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      // Only resize if larger than max dimension
      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
          width = MAX_IMAGE_DIMENSION;
        } else {
          width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
          height = MAX_IMAGE_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          // Create a new file with the resized blob
          const resizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          console.log(`Resized ${file.name}: ${(file.size/1024).toFixed(0)}KB → ${(resizedFile.size/1024).toFixed(0)}KB`);
          resolve(resizedFile);
        },
        'image/jpeg',
        JPEG_QUALITY
      );
    };

    img.src = URL.createObjectURL(file);
  });
}

// --------------------------------------------
// File Upload Handling
// --------------------------------------------
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const extractionResults = document.getElementById('extractionResults');
const processing = document.getElementById('processing');

// Click to select files
dropZone.addEventListener('click', () => fileInput.click());

// Manual entry button
const manualEntryBtn = document.getElementById('manualEntryBtn');
manualEntryBtn.addEventListener('click', () => {
  // Reset any previous state
  editingCaseId = null;
  caseForm.reset();

  // Update UI for manual entry
  document.querySelector('#extractionResults h2').textContent = 'New Case';
  document.querySelector('#extractionResults .info').textContent = 'Enter the case details manually:';
  document.querySelector('#caseForm button[type="submit"]').textContent = 'Save Case';
  document.getElementById('cptHint').textContent = '';
  document.getElementById('categoryHint').textContent = '';

  // Hide upload area, show form
  dropZone.classList.add('hidden');
  document.querySelector('.manual-entry-option').classList.add('hidden');
  extractionResults.classList.remove('hidden');
});

// File selected via input
fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFiles(e.target.files);
  }
});

// Drag and drop events
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  if (e.dataTransfer.files.length > 0) {
    handleFiles(e.dataTransfer.files);
  }
});

// Process uploaded files (supports multiple images, auto-detects single vs batch)
async function handleFiles(files) {
  // Filter to only image files
  const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));

  if (imageFiles.length === 0) {
    alert('Please upload image files');
    return;
  }

  // Show processing indicator
  dropZone.classList.add('hidden');
  document.querySelector('.manual-entry-option').classList.add('hidden');
  extractionResults.classList.add('hidden');
  batchReviewQueue.classList.add('hidden');
  processing.classList.remove('hidden');

  // Get progress elements
  const processingText = document.getElementById('processingText');
  const progressLabel = document.getElementById('progressLabel');

  processingText.textContent = 'Optimizing images...';
  progressLabel.textContent = '';

  try {
    // Resize all images in parallel (for faster upload & lower API costs)
    const resizedImages = await Promise.all(
      imageFiles.map(file => resizeImage(file))
    );

    // Start rotating loading messages
    startLoadingMessages(processingText);
    progressLabel.textContent = resizedImages.length === 1
      ? 'Processing image...'
      : `Processing ${resizedImages.length} images...`;

    // Upload with streaming progress
    const formData = new FormData();
    for (const file of resizedImages) {
      formData.append('images', file);
    }

    const allCases = await new Promise((resolve, reject) => {
      const cases = [];

      fetch('/api/upload-stream', {
        method: 'POST',
        body: formData
      }).then(response => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        function processStream() {
          reader.read().then(({ done, value }) => {
            if (done) {
              resolve(cases);
              return;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const event = JSON.parse(line.slice(6));

                  if (event.type === 'progress') {
                    progressLabel.textContent = event.message;
                  } else if (event.type === 'complete') {
                    for (const caseData of event.cases) {
                      cases.push({
                        filename: caseData._sourceFile || 'upload',
                        data: caseData
                      });
                    }
                  } else if (event.type === 'error') {
                    reject(new Error(event.message));
                  }
                } catch (e) {
                  // Ignore parse errors for incomplete data
                }
              }
            }

            processStream();
          }).catch(reject);
        }

        processStream();
      }).catch(reject);
    });

    if (allCases.length === 0) {
      throw new Error('No cases found in images');
    }

    // Stop the rotating messages
    stopLoadingMessages();

    // Group results by MRN + Date
    processingText.textContent = `Found ${allCases.length} case${allCases.length > 1 ? 's' : ''}. Processing...`;
    batchCases = groupResultsIntoCases(allCases);

    processing.classList.add('hidden');

    if (batchCases.length === 1) {
      // Single case - show the regular form
      const singleCase = batchCases[0];
      populateForm(singleCase.data, singleCase.images.join(', '), singleCase.images.length);
      extractionResults.classList.remove('hidden');
    } else {
      // Multiple cases - show batch review queue
      displayBatchReviewQueue();
    }

  } catch (error) {
    console.error('Upload error:', error);
    stopLoadingMessages();
    alert('Error processing images: ' + error.message);

    // Reset UI
    processing.classList.add('hidden');
    dropZone.classList.remove('hidden');
    document.querySelector('.manual-entry-option').classList.remove('hidden');
  }
}

// Populate form with extracted data
function populateForm(data, filename, imageCount = 1) {
  // Basic fields
  document.getElementById('date_of_surgery').value = data.date_of_surgery || '';
  document.getElementById('patient_mrn').value = data.patient_mrn || '';
  document.getElementById('patient_age').value = data.patient_age || '';
  document.getElementById('attending_surgeon').value = data.attending_surgeon || '';
  document.getElementById('anesthesia_staff').value = data.anesthesia_staff || '';
  document.getElementById('procedure_name').value = data.procedure_name || '';
  document.getElementById('cpt_code').value = data.cpt_code || '';
  document.getElementById('cpt_inferred_note').value = data.cpt_inferred_note || '';
  document.getElementById('case_duration').value = data.case_duration || '';
  document.getElementById('other_details').value = '';  // Left blank for user
  document.getElementById('raw_text').value = data.raw_text || '';
  document.getElementById('filename').value = filename || '';

  // Set gender dropdown
  const genderSelect = document.getElementById('patient_gender');
  if (data.patient_gender === 'Male' || data.patient_gender === 'Female') {
    genderSelect.value = data.patient_gender;
  } else {
    genderSelect.value = '';
  }

  // Set laterality dropdown
  const lateralitySelect = document.getElementById('laterality');
  const lateralityValue = data.laterality || 'N/A';
  if (['Right', 'Left', 'Bilateral', 'N/A'].includes(lateralityValue)) {
    lateralitySelect.value = lateralityValue;
  } else {
    lateralitySelect.value = 'N/A';
  }

  // Set category dropdown
  const categorySelect = document.getElementById('case_category');
  const categoryHint = document.getElementById('categoryHint');
  if (data.case_category) {
    categorySelect.value = data.case_category;
    categoryHint.textContent = 'Detected: ' + data.case_category;
  } else {
    categorySelect.value = '';
    categoryHint.textContent = '';
  }

  // Update the info message based on image count
  const infoElement = document.querySelector('#extractionResults .info');
  if (imageCount > 1) {
    infoElement.textContent = `Data consolidated from ${imageCount} images. Review and edit, then save:`;
  } else {
    infoElement.textContent = 'Review and edit the extracted information, then save:';
  }

  // Show CPT description - prefer Gemini's description, fall back to local lookup
  const cptHint = document.getElementById('cptHint');
  if (data.cpt_inferred_note && data.cpt_inferred_note.length > 0) {
    cptHint.textContent = data.cpt_inferred_note;
  } else {
    const cptDesc = getCptDescription(data.cpt_code);
    cptHint.textContent = cptDesc || '';
  }
}

// --------------------------------------------
// Form Handling
// --------------------------------------------
const caseForm = document.getElementById('caseForm');
const clearFormBtn = document.getElementById('clearForm');

// Save or update case
caseForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    date_of_surgery: document.getElementById('date_of_surgery').value,
    patient_mrn: document.getElementById('patient_mrn').value,
    patient_age: document.getElementById('patient_age').value,
    patient_gender: document.getElementById('patient_gender').value,
    attending_surgeon: document.getElementById('attending_surgeon').value,
    anesthesia_staff: document.getElementById('anesthesia_staff').value,
    procedure_name: document.getElementById('procedure_name').value,
    case_category: document.getElementById('case_category').value,
    cpt_code: document.getElementById('cpt_code').value,
    cpt_inferred_note: document.getElementById('cpt_inferred_note').value,
    laterality: document.getElementById('laterality').value,
    case_duration: document.getElementById('case_duration').value,
    other_details: document.getElementById('other_details').value,
    follow_up_note: document.getElementById('follow_up_note').value,
    follow_up_status: document.getElementById('follow_up_status').value,
    follow_up_due_date: document.getElementById('follow_up_due_date').value,
    raw_text: document.getElementById('raw_text').value,
    filename: document.getElementById('filename').value
  };

  try {
    // Check for duplicates before saving
    if (formData.patient_mrn && formData.date_of_surgery) {
      const dupCheckUrl = `/api/cases/check-duplicate?mrn=${encodeURIComponent(formData.patient_mrn)}&date=${encodeURIComponent(formData.date_of_surgery)}${editingCaseId ? `&excludeId=${editingCaseId}` : ''}`;
      const dupResponse = await fetch(dupCheckUrl);
      const dupResult = await dupResponse.json();

      if (dupResult.duplicate) {
        const existing = dupResult.existingCases[0];
        const proceed = confirm(
          `⚠️ Potential duplicate detected!\n\n` +
          `A case already exists for this patient (MRN: ${formData.patient_mrn}) on ${formData.date_of_surgery}:\n\n` +
          `• ${existing.procedure_name || 'Unknown procedure'}\n` +
          `• Attending: ${existing.attending_surgeon || 'Unknown'}\n` +
          `• CPT: ${existing.cpt_code || 'None'}\n\n` +
          `Save anyway?`
        );
        if (!proceed) {
          return; // User cancelled
        }
      }
    }

    let response;
    let successMessage;

    if (editingCaseId) {
      // Update existing case
      response = await fetch(`/api/cases/${editingCaseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      successMessage = 'Case updated successfully!';
    } else {
      // Create new case
      response = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      successMessage = 'Case saved successfully!';
    }

    const result = await response.json();

    if (result.success) {
      alert(successMessage);
      resetUploadArea();
    } else {
      throw new Error(result.error);
    }

  } catch (error) {
    console.error('Save error:', error);
    alert('Error saving case: ' + error.message);
  }
});

// Clear form
clearFormBtn.addEventListener('click', () => {
  resetUploadArea();
});

function resetUploadArea() {
  // Reset edit mode
  editingCaseId = null;

  // Reset form
  caseForm.reset();
  extractionResults.classList.add('hidden');
  batchReviewQueue.classList.add('hidden');
  dropZone.classList.remove('hidden');
  document.querySelector('.manual-entry-option').classList.remove('hidden');
  fileInput.value = '';
  document.getElementById('cptHint').textContent = '';
  document.getElementById('categoryHint').textContent = '';

  // Reset batch state
  batchCases = [];
  batchCasesList.innerHTML = '';

  // Reset form header and button text (in case we were editing)
  document.querySelector('#extractionResults h2').textContent = 'Extracted Data';
  document.querySelector('#extractionResults .info').textContent = 'Review and edit the extracted information, then save:';
  document.querySelector('#caseForm button[type="submit"]').textContent = 'Save Case';
}

// --------------------------------------------
// Cases List
// --------------------------------------------
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const casesList = document.getElementById('casesList');
const casesListSentinel = document.getElementById('casesListSentinel');
const filterAttending = document.getElementById('filterAttending');
const filterCategory = document.getElementById('filterCategory');
const filterStartDate = document.getElementById('filterStartDate');
const filterEndDate = document.getElementById('filterEndDate');
const filterStatus = document.getElementById('filterStatus');
const filterFollowUp = document.getElementById('filterFollowUp');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

let casesCache = [];
let casesObserver = null;
const caseRenderState = {
  all: [],
  offset: 0,
  pageSize: 40
};
const caseFilters = {
  attending: '',
  category: '',
  startDate: '',
  endDate: '',
  status: '',
  followUp: ''
};

function normalizeSelectValue(value) {
  return (value || '').trim();
}

function updateSelectOptions(selectEl, values, placeholder) {
  if (!selectEl) return;
  const current = selectEl.value;
  const uniqueValues = Array.from(new Set(values.filter(v => v && v.trim())))
    .sort((a, b) => a.localeCompare(b));

  selectEl.innerHTML = [
    `<option value="">${placeholder}</option>`,
    ...uniqueValues.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`)
  ].join('');

  if (current && uniqueValues.includes(current)) {
    selectEl.value = current;
  } else {
    selectEl.value = '';
  }
}

function hasActiveFilters(filters) {
  return Boolean(
    filters.attending
    || filters.category
    || filters.status
    || filters.startDate
    || filters.endDate
    || filters.followUp
  );
}

function filterCasesByCriteria(cases, filters) {
  let filtered = [...cases];

  if (filters.attending) {
    filtered = filtered.filter(c => (c.attending_surgeon || '') === filters.attending);
  }

  if (filters.category) {
    filtered = filtered.filter(c => (c.case_category || '') === filters.category);
  }

  if (filters.status) {
    filtered = filtered.filter(c => {
      const submitted = Boolean(c.submitted_to_acgme);
      return filters.status === 'submitted' ? submitted : !submitted;
    });
  }

  if (filters.followUp) {
    filtered = filtered.filter(c => {
      const status = (c.follow_up_status || 'none').toLowerCase();
      if (filters.followUp === 'due_now') return isFollowUpDue(c);
      return status === filters.followUp;
    });
  }

  if (filters.startDate || filters.endDate) {
    const dateFiltered = filterCasesByDateRange(filtered, filters.startDate, filters.endDate);
    filtered = dateFiltered.filtered;
  }

  return filtered;
}

function getCaseSortDate(caseData) {
  const primary = parseCaseDateTime(caseData.date_of_surgery);
  if (primary) return primary;
  return parseCaseDateTime(caseData.created_at);
}

function sortCasesBySurgeryDateDesc(cases) {
  return [...cases].sort((a, b) => {
    const dateA = getCaseSortDate(a);
    const dateB = getCaseSortDate(b);
    const timeA = dateA ? dateA.getTime() : 0;
    const timeB = dateB ? dateB.getTime() : 0;
    if (timeA !== timeB) return timeB - timeA;
    return (b.id || 0) - (a.id || 0);
  });
}

function applyCaseFilters() {
  const filtered = filterCasesByCriteria(casesCache, caseFilters);
  const sorted = sortCasesBySurgeryDateDesc(filtered);
  displayCases(sorted);
}

// Load all cases
async function loadCases(searchQuery = '') {
  try {
    const url = searchQuery
      ? `/api/cases/search?q=${encodeURIComponent(searchQuery)}`
      : '/api/cases';

    const response = await fetch(url);
    const cases = await response.json();

    casesCache = cases;
    updateSelectOptions(filterAttending, cases.map(c => c.attending_surgeon), 'All');
    updateSelectOptions(filterCategory, cases.map(c => c.case_category), 'All');
    applyCaseFilters();

  } catch (error) {
    console.error('Load cases error:', error);
    casesList.innerHTML = '<p class="error">Error loading cases</p>';
  }
}

// Display cases in the list
function displayCases(cases) {
  const batchActionsBar = document.getElementById('batchActionsBar');
  if (cases.length === 0) {
    casesList.innerHTML = `
      <div class="empty-state">
        <div class="icon">📋</div>
        <p>No cases found</p>
        <p>Upload images to start logging your cases</p>
      </div>
    `;
    if (batchActionsBar) {
      batchActionsBar.classList.add('hidden');
    }
    if (casesListSentinel) {
      casesListSentinel.classList.add('hidden');
    }
    return;
  }

  // Show batch actions bar
  if (batchActionsBar) {
    batchActionsBar.classList.remove('hidden');
  }
  resetCasesInfiniteScroll(cases);
}

function isFollowUpDue(caseData) {
  const status = (caseData.follow_up_status || 'none').toLowerCase();
  if (status !== 'due') return false;
  const dueDate = parseCaseDateTime(caseData.follow_up_due_date);
  if (!dueDate) return true;
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return dueDate <= startOfToday;
}

function getFollowUpBadge(caseData) {
  const status = (caseData.follow_up_status || 'none').toLowerCase();
  if (status === 'none') return '';
  const dueDate = caseData.follow_up_due_date || '';
  const isPastDue = status === 'due' && isFollowUpDue(caseData);
  const label = status === 'done'
    ? 'Done'
    : isPastDue
      ? 'Past Due'
      : 'Scheduled';
  const dueText = dueDate ? ` • ${dueDate}` : '';
  const dueClass = isPastDue ? 'due' : '';
  return `<span class="followup-badge ${status} ${dueClass}">FU ${label}${dueText}</span>`;
}

function renderCaseCard(c) {
  return `
    <div class="case-card" data-id="${c.id}">
      <div class="case-card-header">
        <input type="checkbox" class="case-checkbox" data-id="${c.id}" onchange="updateSelectedCount()">
        <div style="flex: 1;">
          <h3>
            ${c.procedure_name || 'Unnamed Procedure'}
            <span class="acgme-badge ${c.submitted_to_acgme ? 'submitted' : 'pending'}"
                  onclick="event.stopPropagation(); toggleAcgmeStatus(${c.id}, ${c.submitted_to_acgme ? 'true' : 'false'})"
                  title="Click to toggle ACGME status">
              ${c.submitted_to_acgme ? '✓ ACGME' : '○ Pending'}
            </span>
            <span class="attachment-badge ${c.image_count > 0 ? 'has-images' : ''}" id="attach-badge-${c.id}"
                  onclick="event.stopPropagation(); openAttachmentModal(${c.id})"
                  title="Manage attachments">
              📎${c.image_count > 0 ? ` ${c.image_count}` : ''}
            </span>
          </h3>
        </div>
      </div>
      ${c.case_category ? `<div class="category-tag">${c.case_category}</div>` : ''}
      ${getFollowUpBadge(c)}
      <div class="meta">
        <div class="meta-item"><strong>Date:</strong> ${c.date_of_surgery || 'N/A'}</div>
        <div class="meta-item"><strong>MRN:</strong> ${c.patient_mrn || 'N/A'}</div>
        <div class="meta-item"><strong>Age/Sex:</strong> ${c.patient_age || '?'}${c.patient_gender ? (c.patient_gender === 'Male' ? 'M' : 'F') : ''}</div>
        <div class="meta-item"><strong>Attending:</strong> ${c.attending_surgeon || 'N/A'}</div>
        <div class="meta-item"><strong>CPT:</strong> ${c.cpt_code || 'N/A'}${(c.cpt_inferred_note || getCptDescription(c.cpt_code)) ? ` (${c.cpt_inferred_note || getCptDescription(c.cpt_code)})` : ''}</div>
        <div class="meta-item"><strong>Laterality:</strong> ${c.laterality || 'N/A'}</div>
        <div class="meta-item"><strong>Duration:</strong> ${c.case_duration || 'N/A'}</div>
        ${c.anesthesia_staff && c.anesthesia_staff !== 'Not found' ? `<div class="meta-item"><strong>Anesthesia:</strong> ${c.anesthesia_staff}</div>` : ''}
      </div>
      ${c.other_details && c.other_details.length > 0 ? `<p><strong>Notes:</strong> ${c.other_details}</p>` : ''}
      <div class="raw-data-section">
        <div class="raw-data-label">ID: ${c.id} | Created: ${c.created_at || 'N/A'} | Source: ${c.image_filename || 'Manual'}</div>
        ${c.raw_extracted_text ? `<div class="raw-data-text">${c.raw_extracted_text}</div>` : ''}
      </div>
      <div class="actions">
        <button class="btn primary" onclick="editCase(${c.id})">Edit</button>
        <button class="btn danger" onclick="deleteCase(${c.id})">Delete</button>
      </div>
    </div>
  `;
}

function resetCasesInfiniteScroll(cases) {
  caseRenderState.all = cases;
  caseRenderState.offset = 0;
  casesList.innerHTML = '';

  if (casesListSentinel) {
    casesListSentinel.textContent = 'Loading more...';
    casesListSentinel.classList.toggle('hidden', cases.length === 0);
  }

  renderNextCasesPage();
  ensureCasesObserver();

  // Reset select all checkbox
  document.getElementById('selectAllCases').checked = false;
  updateSelectedCount();
}

function renderNextCasesPage() {
  const start = caseRenderState.offset;
  const end = Math.min(start + caseRenderState.pageSize, caseRenderState.all.length);
  const slice = caseRenderState.all.slice(start, end);

  if (slice.length > 0) {
    casesList.insertAdjacentHTML('beforeend', slice.map(renderCaseCard).join(''));
  }

  caseRenderState.offset = end;
  if (casesListSentinel && caseRenderState.offset >= caseRenderState.all.length) {
    casesListSentinel.classList.add('hidden');
  }
}

function ensureCasesObserver() {
  if (casesObserver || !casesListSentinel) return;
  casesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && caseRenderState.offset < caseRenderState.all.length) {
        renderNextCasesPage();
      }
    });
  }, { rootMargin: '200px' });
  casesObserver.observe(casesListSentinel);
}

// Search cases
searchBtn.addEventListener('click', () => {
  loadCases(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    loadCases(searchInput.value);
  }
});

filterAttending?.addEventListener('change', () => {
  caseFilters.attending = normalizeSelectValue(filterAttending.value);
  applyCaseFilters();
});

filterCategory?.addEventListener('change', () => {
  caseFilters.category = normalizeSelectValue(filterCategory.value);
  applyCaseFilters();
});

filterStartDate?.addEventListener('change', () => {
  caseFilters.startDate = filterStartDate.value || '';
  applyCaseFilters();
});

filterEndDate?.addEventListener('change', () => {
  caseFilters.endDate = filterEndDate.value || '';
  applyCaseFilters();
});

filterStatus?.addEventListener('change', () => {
  caseFilters.status = normalizeSelectValue(filterStatus.value);
  applyCaseFilters();
});

filterFollowUp?.addEventListener('change', () => {
  caseFilters.followUp = normalizeSelectValue(filterFollowUp.value);
  applyCaseFilters();
});

clearFiltersBtn?.addEventListener('click', () => {
  caseFilters.attending = '';
  caseFilters.category = '';
  caseFilters.startDate = '';
  caseFilters.endDate = '';
  caseFilters.status = '';
  caseFilters.followUp = '';
  if (filterAttending) filterAttending.value = '';
  if (filterCategory) filterCategory.value = '';
  if (filterStartDate) filterStartDate.value = '';
  if (filterEndDate) filterEndDate.value = '';
  if (filterStatus) filterStatus.value = '';
  if (filterFollowUp) filterFollowUp.value = '';
  applyCaseFilters();
});

// --------------------------------------------
// Follow-Up Queue
// --------------------------------------------
const followupList = document.getElementById('followupList');
const followupFilterStatus = document.getElementById('followupFilterStatus');

function getFollowUpSortValue(caseData) {
  const dueDate = parseCaseDateTime(caseData.follow_up_due_date);
  if (!dueDate) return Number.MAX_SAFE_INTEGER;
  return dueDate.getTime();
}

function filterFollowUpCases(cases, filterValue) {
  const status = (filterValue || 'due_now').toLowerCase();
  if (status === 'all') {
    return cases.filter(c => (c.follow_up_status || 'none').toLowerCase() === 'due');
  }
  if (status === 'due_now') {
    return cases.filter(c => isFollowUpDue(c));
  }
  return cases.filter(c => (c.follow_up_status || 'none').toLowerCase() === status);
}

function renderFollowUpList(cases) {
  if (!followupList) return;
  if (cases.length === 0) {
    followupList.innerHTML = '<div class="empty-state"><div class="icon">🗂️</div><p>No follow-ups found</p></div>';
    return;
  }

  followupList.innerHTML = cases.map(c => {
    const dueDate = c.follow_up_due_date || 'N/A';
    const status = (c.follow_up_status || 'none').toLowerCase();
    const isPastDue = status === 'due' && isFollowUpDue(c);
    const statusLabel = status === 'done' ? 'Done' : isPastDue ? 'Past Due' : 'Scheduled';
    const badgeClass = isPastDue ? 'due' : '';
    return `
      <div class="followup-card">
        <div class="followup-header">
          <h3>${c.procedure_name || 'Unnamed Procedure'}</h3>
          <span class="followup-badge ${status} ${badgeClass}">FU ${statusLabel}</span>
        </div>
        <div class="meta">
          <div class="meta-item"><strong>Date:</strong> ${c.date_of_surgery || 'N/A'}</div>
          <div class="meta-item"><strong>MRN:</strong> ${c.patient_mrn || 'N/A'}</div>
          <div class="meta-item"><strong>Attending:</strong> ${c.attending_surgeon || 'N/A'}</div>
          <div class="meta-item"><strong>Due:</strong> ${dueDate}</div>
        </div>
        ${c.follow_up_note ? `<p><strong>Follow-Up:</strong> ${escapeHtml(c.follow_up_note)}</p>` : ''}
        <div class="actions">
          <button class="btn secondary" onclick="markFollowUpDone(${c.id})">Mark Done</button>
          <button class="btn" onclick="editCase(${c.id})">Edit</button>
        </div>
      </div>
    `;
  }).join('');
}

async function loadFollowUpQueue() {
  try {
    const response = await fetch('/api/cases');
    const cases = await response.json();
    const filtered = filterFollowUpCases(cases, followupFilterStatus?.value || 'due_now');
    const sorted = [...filtered].sort((a, b) => getFollowUpSortValue(a) - getFollowUpSortValue(b));
    renderFollowUpList(sorted);
  } catch (error) {
    console.error('Error loading follow-up queue:', error);
    if (followupList) {
      followupList.innerHTML = '<p class="error">Error loading follow-up queue</p>';
    }
  }
}

followupFilterStatus?.addEventListener('change', () => {
  loadFollowUpQueue();
});

async function markFollowUpDone(caseId) {
  try {
    const response = await fetch(`/api/cases/${caseId}/follow-up`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ follow_up_status: 'done' })
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to update follow-up');
    }
    loadFollowUpQueue();
    loadCases(searchInput?.value || '');
    loadCasesTable();
  } catch (error) {
    alert('Error updating follow-up: ' + error.message);
  }
}

// Delete a case
async function deleteCase(id) {
  if (!confirm('Are you sure you want to delete this case?')) {
    return;
  }

  try {
    const response = await fetch(`/api/cases/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (result.success) {
      loadCases(searchInput.value);
    } else {
      throw new Error(result.error);
    }

  } catch (error) {
    console.error('Delete error:', error);
    alert('Error deleting case: ' + error.message);
  }
}

// Edit a case
async function editCase(id) {
  try {
    // Fetch the case data
    const response = await fetch(`/api/cases/${id}`);
    const caseData = await response.json();

    if (caseData.error) {
      throw new Error(caseData.error);
    }

    // Set edit mode
    editingCaseId = id;

    // Populate the form with existing data
    document.getElementById('date_of_surgery').value = caseData.date_of_surgery || '';
    document.getElementById('patient_mrn').value = caseData.patient_mrn || '';
    document.getElementById('patient_age').value = caseData.patient_age || '';
    document.getElementById('patient_gender').value = caseData.patient_gender || '';
    document.getElementById('attending_surgeon').value = caseData.attending_surgeon || '';
    document.getElementById('anesthesia_staff').value = caseData.anesthesia_staff || '';
    document.getElementById('procedure_name').value = caseData.procedure_name || '';
    document.getElementById('case_category').value = caseData.case_category || '';
    document.getElementById('cpt_code').value = caseData.cpt_code || '';
    document.getElementById('cpt_inferred_note').value = caseData.cpt_inferred_note || '';
    document.getElementById('laterality').value = caseData.laterality || 'N/A';
    document.getElementById('case_duration').value = caseData.case_duration || '';
    document.getElementById('other_details').value = caseData.other_details || '';
    document.getElementById('follow_up_note').value = caseData.follow_up_note || '';
    document.getElementById('follow_up_status').value = caseData.follow_up_status || 'none';
    document.getElementById('follow_up_due_date').value = caseData.follow_up_due_date || '';
    document.getElementById('raw_text').value = caseData.raw_extracted_text || '';
    document.getElementById('filename').value = caseData.image_filename || '';

    // Update form header to show we're editing
    document.querySelector('#extractionResults h2').textContent = 'Edit Case';
    document.querySelector('#extractionResults .info').textContent = 'Modify the case details and save:';

    // Update button text
    document.querySelector('#caseForm button[type="submit"]').textContent = 'Update Case';

    // Clear any hints
    document.getElementById('cptHint').textContent = '';
    document.getElementById('categoryHint').textContent = '';

    // Switch to upload tab and show form
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector('[data-tab="upload"]').classList.add('active');
    document.getElementById('upload').classList.add('active');

    // Hide upload area, show form
    dropZone.classList.add('hidden');
    extractionResults.classList.remove('hidden');

  } catch (error) {
    console.error('Edit error:', error);
    alert('Error loading case for editing: ' + error.message);
  }
}

// --------------------------------------------
// Export
// --------------------------------------------
const exportCsvBtn = document.getElementById('exportCsv');
const exportStatus = document.getElementById('exportStatus');
const backupBtn = document.getElementById('backupBtn');
const restoreBtn = document.getElementById('restoreBtn');
const restoreFileInput = document.getElementById('restoreFile');

exportCsvBtn.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/export/csv');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    // Download the CSV file
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'case-log-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    exportStatus.className = 'success';
    exportStatus.textContent = 'Export downloaded successfully!';

  } catch (error) {
    console.error('Export error:', error);
    exportStatus.className = 'error';
    exportStatus.textContent = 'Error: ' + error.message;
  }
});

backupBtn?.addEventListener('click', async () => {
  try {
    exportStatus.className = '';
    exportStatus.textContent = 'Preparing backup...';
    const response = await fetch('/api/backup');
    if (!response.ok) {
      throw new Error('Failed to create backup');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const disposition = response.headers.get('Content-Disposition') || '';
    const match = disposition.match(/filename=([^;]+)/);
    const filename = match ? match[1] : 'case-logger-backup.zip';
    a.href = downloadUrl;
    a.download = filename.replace(/"/g, '');
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    a.remove();

    exportStatus.className = 'success';
    exportStatus.textContent = 'Backup downloaded successfully!';
  } catch (error) {
    exportStatus.className = 'error';
    exportStatus.textContent = 'Error: ' + error.message;
  }
});

restoreBtn?.addEventListener('click', () => {
  restoreFileInput?.click();
});

restoreFileInput?.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const confirmMsg = 'Restore this backup?\n\nThis will replace your current database and attachments.';
  if (!confirm(confirmMsg)) {
    restoreFileInput.value = '';
    return;
  }

  try {
    exportStatus.className = '';
    exportStatus.textContent = 'Restoring backup...';

    const formData = new FormData();
    formData.append('backup', file);

    const response = await fetch('/api/restore', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to restore backup');
    }

    const notices = [];
    if (!result.restoredUploads) {
      notices.push('attachments unchanged');
    }
    if (!result.restoredQueue) {
      notices.push('queue unchanged');
    }
    const noticeText = notices.length ? ` (${notices.join(', ')})` : '';
    exportStatus.className = 'success';
    exportStatus.textContent = `Backup restored${noticeText}. Reloading data...`;

    loadCases(searchInput?.value || '');
    loadCasesTable();
    loadStats();
  } catch (error) {
    exportStatus.className = 'error';
    exportStatus.textContent = 'Error: ' + error.message;
  } finally {
    restoreFileInput.value = '';
  }
});

// --------------------------------------------
// Initial Load
// --------------------------------------------
// Nothing to load on initial page load - cases load when tab is clicked

// --------------------------------------------
// Batch Review (for multiple cases from upload)
// --------------------------------------------
const batchReviewQueue = document.getElementById('batchReviewQueue');
const batchCasesList = document.getElementById('batchCasesList');

let batchCases = []; // Store grouped cases for review

// Group extraction results into cases by MRN + Date
function groupResultsIntoCases(results) {
  const groups = {};

  for (const result of results) {
    const mrn = result.data.patient_mrn || 'unknown';
    const date = result.data.date_of_surgery || 'unknown';
    const key = `${mrn}_${date}`;

    if (!groups[key]) {
      groups[key] = {
        images: [],
        data: { ...result.data }
      };
    } else {
      // Merge data - prefer non-empty values
      const existing = groups[key].data;
      for (const field of Object.keys(result.data)) {
        const newVal = result.data[field];
        const existingVal = existing[field];
        if (newVal && newVal !== 'Not found' && (!existingVal || existingVal === 'Not found')) {
          existing[field] = newVal;
        }
      }
    }
    groups[key].images.push(result.filename);
  }

  // Convert to array
  return Object.values(groups).map((group, index) => ({
    id: index,
    images: group.images,
    data: group.data
  }));
}

// Display the batch review queue
function displayBatchReviewQueue() {
  document.getElementById('caseCount').textContent = batchCases.length;
  batchReviewQueue.classList.remove('hidden');

  // Generate category options HTML
  const categoryOptions = `
    <option value="">-- Select --</option>
    <optgroup label="Cranial">
      <option value="Cranial: Tumor General">Cranial: Tumor General</option>
      <option value="Cranial: Tumor Sellar/Parasellar">Cranial: Tumor Sellar/Parasellar</option>
      <option value="Cranial: Trauma/Other">Cranial: Trauma/Other</option>
      <option value="Cranial: Vascular Open">Cranial: Vascular Open</option>
      <option value="Cranial: Vascular Endovascular">Cranial: Vascular Endovascular</option>
      <option value="Cranial: Vascular Total">Cranial: Vascular Total</option>
      <option value="Cranial: CSF Diversion/ETV/Other">Cranial: CSF Diversion/ETV/Other</option>
      <option value="Cranial/Extracranial: Pain">Cranial/Extracranial: Pain</option>
      <option value="Cranial/Extracranial: Functional Disorders">Cranial/Extracranial: Functional Disorders</option>
      <option value="Cranial/Extracranial: Epilepsy">Cranial/Extracranial: Epilepsy</option>
    </optgroup>
    <optgroup label="Spinal">
      <option value="Spinal: Anterior Cervical">Spinal: Anterior Cervical</option>
      <option value="Spinal: Posterior Cervical">Spinal: Posterior Cervical</option>
      <option value="Spinal: Thoracic/Lumbar/Sacral Instrumentation Fusion">Spinal: T/L/S Instrumentation Fusion</option>
      <option value="Spinal: Lumbar Laminectomy/Laminotomy">Spinal: Lumbar Laminectomy/Laminotomy</option>
      <option value="Spinal: Stimulation/Lesion/Pump/Other">Spinal: Stimulation/Lesion/Pump/Other</option>
    </optgroup>
    <optgroup label="Peripheral Nerve">
      <option value="Peripheral Nerve">Peripheral Nerve</option>
    </optgroup>
    <optgroup label="Pediatric">
      <option value="Pediatric: Cranial Tumor">Pediatric: Cranial Tumor</option>
      <option value="Pediatric: Cranial Trauma/Other">Pediatric: Cranial Trauma/Other</option>
      <option value="Pediatric: CSF Diversion/ETV/Other">Pediatric: CSF Diversion/ETV/Other</option>
      <option value="Pediatric: Spine">Pediatric: Spine</option>
    </optgroup>
  `;

  batchCasesList.innerHTML = batchCases.map(c => `
    <div class="batch-case-card" data-case-id="${c.id}">
      <div class="batch-case-header" onclick="toggleBatchCase(${c.id})">
        <div>
          <h3>${c.data.procedure_name || 'Unknown Procedure'}</h3>
          <div class="case-summary">${c.data.date_of_surgery || 'No date'} | MRN: ${c.data.patient_mrn || 'N/A'} | ${c.data.attending_surgeon || 'No attending'}</div>
        </div>
        <button class="toggle-btn">▼</button>
      </div>
      <div class="batch-case-details">
        <div class="form-row">
          <div class="form-group">
            <label>Date</label>
            <input type="text" data-field="date_of_surgery" value="${c.data.date_of_surgery || ''}">
          </div>
          <div class="form-group">
            <label>MRN</label>
            <input type="text" data-field="patient_mrn" value="${c.data.patient_mrn || ''}">
          </div>
          <div class="form-group small">
            <label>Age</label>
            <input type="text" data-field="patient_age" value="${c.data.patient_age || ''}">
          </div>
          <div class="form-group small">
            <label>Gender</label>
            <select data-field="patient_gender">
              <option value="">--</option>
              <option value="Male" ${c.data.patient_gender === 'Male' ? 'selected' : ''}>Male</option>
              <option value="Female" ${c.data.patient_gender === 'Female' ? 'selected' : ''}>Female</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Attending</label>
            <input type="text" data-field="attending_surgeon" value="${c.data.attending_surgeon || ''}">
          </div>
          <div class="form-group">
            <label>Anesthesia</label>
            <input type="text" data-field="anesthesia_staff" value="${c.data.anesthesia_staff || ''}">
          </div>
        </div>
        <div class="form-group">
          <label>Procedure</label>
          <input type="text" data-field="procedure_name" value="${escapeHtml(c.data.procedure_name || '')}">
        </div>
        <div class="form-group">
          <label>Category</label>
          <select data-field="case_category">${categoryOptions.replace(`value="${c.data.case_category}"`, `value="${c.data.case_category}" selected`)}</select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>CPT Code</label>
            <input type="text" data-field="cpt_code" value="${c.data.cpt_code || ''}">
            ${(c.data.cpt_inferred_note || getCptDescription(c.data.cpt_code)) ? `<span class="hint">${c.data.cpt_inferred_note || getCptDescription(c.data.cpt_code)}</span>` : ''}
          </div>
          <div class="form-group">
            <label>Laterality</label>
            <select data-field="laterality">
              <option value="N/A" ${c.data.laterality === 'N/A' ? 'selected' : ''}>N/A</option>
              <option value="Right" ${c.data.laterality === 'Right' ? 'selected' : ''}>Right</option>
              <option value="Left" ${c.data.laterality === 'Left' ? 'selected' : ''}>Left</option>
              <option value="Bilateral" ${c.data.laterality === 'Bilateral' ? 'selected' : ''}>Bilateral</option>
            </select>
          </div>
          <div class="form-group">
            <label>Duration</label>
            <input type="text" data-field="case_duration" value="${c.data.case_duration || ''}">
          </div>
        </div>
        <div class="form-group">
          <label>Notes</label>
          <textarea data-field="other_details" rows="1" placeholder="Optional notes...">${c.data.other_details || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Follow-Up</label>
          <textarea data-field="follow_up_note" rows="1" placeholder="Imaging or clinical follow-up...">${c.data.follow_up_note || ''}</textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Follow-Up Status</label>
            <select data-field="follow_up_status">
              <option value="none" ${c.data.follow_up_status === 'none' ? 'selected' : ''}>None</option>
              <option value="due" ${c.data.follow_up_status === 'due' ? 'selected' : ''}>Due</option>
              <option value="done" ${c.data.follow_up_status === 'done' ? 'selected' : ''}>Done</option>
            </select>
          </div>
          <div class="form-group">
            <label>Follow-Up Due Date</label>
            <input type="date" data-field="follow_up_due_date" value="${c.data.follow_up_due_date || ''}">
          </div>
        </div>
        <div class="batch-case-actions">
          <button class="btn danger" onclick="removeBatchCase(${c.id})">Remove Case</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Helper to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Toggle case card expand/collapse
function toggleBatchCase(caseId) {
  const card = document.querySelector(`.batch-case-card[data-case-id="${caseId}"]`);
  card.classList.toggle('collapsed');
  const btn = card.querySelector('.toggle-btn');
  btn.textContent = card.classList.contains('collapsed') ? '▶' : '▼';
}

// Remove a case from batch
function removeBatchCase(caseId) {
  batchCases = batchCases.filter(c => c.id !== caseId);
  document.querySelector(`.batch-case-card[data-case-id="${caseId}"]`).remove();
  document.getElementById('caseCount').textContent = batchCases.length;

  if (batchCases.length === 0) {
    resetBatchUI();
  }
}

// Save all batch cases
document.getElementById('saveAllCasesBtn').addEventListener('click', async () => {
  // Collect data from all case forms
  const casesToSave = [];

  for (const batchCase of batchCases) {
    const card = document.querySelector(`.batch-case-card[data-case-id="${batchCase.id}"]`);

    const caseData = {
      date_of_surgery: card.querySelector('[data-field="date_of_surgery"]').value,
      patient_mrn: card.querySelector('[data-field="patient_mrn"]').value,
      patient_age: card.querySelector('[data-field="patient_age"]').value,
      patient_gender: card.querySelector('[data-field="patient_gender"]').value,
      attending_surgeon: card.querySelector('[data-field="attending_surgeon"]').value,
      anesthesia_staff: card.querySelector('[data-field="anesthesia_staff"]').value,
      procedure_name: card.querySelector('[data-field="procedure_name"]').value,
      case_category: card.querySelector('[data-field="case_category"]').value,
      cpt_code: card.querySelector('[data-field="cpt_code"]').value,
      cpt_inferred_note: batchCase.data.cpt_inferred_note || '',
      laterality: card.querySelector('[data-field="laterality"]').value,
      case_duration: card.querySelector('[data-field="case_duration"]').value,
      other_details: card.querySelector('[data-field="other_details"]').value,
      follow_up_note: card.querySelector('[data-field="follow_up_note"]').value,
      follow_up_status: card.querySelector('[data-field="follow_up_status"]').value,
      follow_up_due_date: card.querySelector('[data-field="follow_up_due_date"]').value,
      raw_text: batchCase.data.raw_text || '',
      filename: batchCase.images.join(', ')
    };

    casesToSave.push(caseData);
  }

  // Check for duplicates before saving
  const duplicates = [];
  for (const caseData of casesToSave) {
    if (caseData.patient_mrn && caseData.date_of_surgery) {
      try {
        const dupCheckUrl = `/api/cases/check-duplicate?mrn=${encodeURIComponent(caseData.patient_mrn)}&date=${encodeURIComponent(caseData.date_of_surgery)}`;
        const dupResponse = await fetch(dupCheckUrl);
        const dupResult = await dupResponse.json();
        if (dupResult.duplicate) {
          duplicates.push({
            newCase: caseData,
            existing: dupResult.existingCases[0]
          });
        }
      } catch (e) {
        // Ignore duplicate check errors
      }
    }
  }

  // Warn about duplicates
  if (duplicates.length > 0) {
    const dupList = duplicates.map(d =>
      `• MRN ${d.newCase.patient_mrn} on ${d.newCase.date_of_surgery}`
    ).join('\n');
    const proceed = confirm(
      `⚠️ ${duplicates.length} potential duplicate(s) detected:\n\n${dupList}\n\nSave all cases anyway?`
    );
    if (!proceed) {
      return;
    }
  }

  // Save each case
  let savedCount = 0;
  let errorCount = 0;

  for (const caseData of casesToSave) {
    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseData)
      });

      const result = await response.json();
      if (result.success) {
        savedCount++;
      } else {
        errorCount++;
      }
    } catch (error) {
      errorCount++;
    }
  }

  if (errorCount === 0) {
    alert(`Successfully saved ${savedCount} case${savedCount > 1 ? 's' : ''}!`);
    resetBatchUI();
  } else {
    alert(`Saved ${savedCount} cases. ${errorCount} failed to save.`);
  }
});

// Clear batch
document.getElementById('clearBatchBtn').addEventListener('click', () => {
  if (confirm('Clear all cases? This cannot be undone.')) {
    resetBatchUI();
  }
});

// Reset batch UI and return to upload area
function resetBatchUI() {
  batchCases = [];
  batchCasesList.innerHTML = '';
  batchReviewQueue.classList.add('hidden');
  dropZone.classList.remove('hidden');
  document.querySelector('.manual-entry-option').classList.remove('hidden');
  fileInput.value = '';
}

// ============================================
// BATCH ACTIONS FOR MY CASES
// ============================================

// Get selected case IDs
function getSelectedCaseIds() {
  const checkboxes = document.querySelectorAll('.case-checkbox:checked');
  return Array.from(checkboxes).map(cb => cb.dataset.id);
}

// Update selected count display
function updateSelectedCount() {
  const selectedIds = getSelectedCaseIds();
  const countEl = document.getElementById('selectedCount');
  if (countEl) {
    countEl.textContent = `${selectedIds.length} selected`;
  }

  // Update card styling
  document.querySelectorAll('.case-card').forEach(card => {
    const checkbox = card.querySelector('.case-checkbox');
    if (checkbox && checkbox.checked) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
}

// Select all checkbox handler
document.getElementById('selectAllCases')?.addEventListener('change', (e) => {
  const checkboxes = document.querySelectorAll('.case-checkbox');
  checkboxes.forEach(cb => cb.checked = e.target.checked);
  updateSelectedCount();
});

// Delete selected cases
document.getElementById('deleteSelectedBtn')?.addEventListener('click', async () => {
  const selectedIds = getSelectedCaseIds();

  if (selectedIds.length === 0) {
    alert('No cases selected');
    return;
  }

  if (!confirm(`Delete ${selectedIds.length} case${selectedIds.length > 1 ? 's' : ''}? This cannot be undone.`)) {
    return;
  }

  let deleted = 0;
  let failed = 0;

  for (const id of selectedIds) {
    try {
      const response = await fetch(`/api/cases/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        deleted++;
      } else {
        failed++;
      }
    } catch (error) {
      failed++;
    }
  }

  if (failed === 0) {
    alert(`Deleted ${deleted} case${deleted > 1 ? 's' : ''}`);
  } else {
    alert(`Deleted ${deleted}, failed to delete ${failed}`);
  }

  loadCases(document.getElementById('searchInput').value);
});

// Submit selected cases to ACGME queue
document.getElementById('submitToAcgmeBtn')?.addEventListener('click', async () => {
  const selectedIds = getSelectedCaseIds();

  if (selectedIds.length === 0) {
    alert('No cases selected. Check the boxes next to cases you want to submit.');
    return;
  }

  try {
    // Add to queue
    const response = await fetch('/api/acgme-queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseIds: selectedIds })
    });
    const result = await response.json();

    if (result.success) {
      // Copy simple command to clipboard
      const command = 'process ACGME queue';
      try {
        await navigator.clipboard.writeText(command);
      } catch (e) {}

      alert(`✓ ${result.added} case(s) added to ACGME queue!

Total in queue: ${result.queueLength}

In Claude Code, say: "process ACGME queue"

(Command copied to clipboard)`);

      // Uncheck all selected
      document.querySelectorAll('.case-checkbox:checked').forEach(cb => cb.checked = false);
      updateSelectedCount();
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    alert('Error adding to queue: ' + error.message);
  }
});

// Clear the ACGME submission queue
document.getElementById('clearQueueBtn')?.addEventListener('click', async () => {
  try {
    const checkResponse = await fetch('/api/acgme-queue');
    const checkResult = await checkResponse.json();

    if (checkResult.queue.length === 0) {
      alert('Queue is already empty.');
      return;
    }

    if (!confirm(`Clear ${checkResult.queue.length} case(s) from the ACGME queue?`)) {
      return;
    }

    const response = await fetch('/api/acgme-queue', { method: 'DELETE' });
    const result = await response.json();

    if (result.success) {
      alert('✓ ACGME queue cleared.');
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    alert('Error clearing queue: ' + error.message);
  }
});

// Toggle ACGME submission status
async function toggleAcgmeStatus(id, currentlySubmitted) {
  try {
    const endpoint = currentlySubmitted
      ? `/api/cases/${id}/unmark-submitted`
      : `/api/cases/${id}/mark-submitted`;

    const response = await fetch(endpoint, { method: 'POST' });
    const result = await response.json();

    if (result.success) {
      loadCases(); // Reload to show updated status
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Toggle ACGME status error:', error);
    alert('Error updating ACGME status: ' + error.message);
  }
}

// Clear CPT description when CPT code is manually changed
document.getElementById('cpt_code')?.addEventListener('input', () => {
  // Clear the inferred note when user manually changes CPT code
  const inferredNote = document.getElementById('cpt_inferred_note');
  if (inferredNote) {
    inferredNote.value = '';
  }
  // Also clear the hint display
  const cptHint = document.getElementById('cptHint');
  if (cptHint) {
    cptHint.textContent = '';
  }
});

// --------------------------------------------
// Image Attachment Modal
// --------------------------------------------
let currentAttachmentCaseId = null;

// Open attachment modal for a case
async function openAttachmentModal(caseId) {
  currentAttachmentCaseId = caseId;
  const modal = document.getElementById('attachmentModal');
  const grid = document.getElementById('attachmentGrid');
  const countSpan = document.getElementById('attachmentCount');

  // Show modal
  modal.classList.remove('hidden');
  grid.innerHTML = '<p class="loading">Loading attachments...</p>';

  try {
    const response = await fetch(`/api/cases/${caseId}/images`);
    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    const images = result.images || [];
    countSpan.textContent = `(${images.length})`;

    if (images.length === 0) {
      grid.innerHTML = '<p class="empty-attachments">No attachments yet. Click "+ Add Images" to attach imaging.</p>';
    } else {
      grid.innerHTML = images.map(img => `
        <div class="attachment-thumb" data-id="${img.id}">
          <img src="/api/images/${img.id}" alt="${img.original_name}" onclick="window.open('/api/images/${img.id}', '_blank')">
          <button class="delete-attachment" onclick="deleteAttachment(${img.id})" title="Delete">&times;</button>
          <div class="attachment-name">${img.original_name || 'image'}</div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading attachments:', error);
    grid.innerHTML = '<p class="error">Error loading attachments</p>';
  }
}

// Close attachment modal
function closeAttachmentModal() {
  const modal = document.getElementById('attachmentModal');
  modal.classList.add('hidden');
  currentAttachmentCaseId = null;
}

// Delete an attachment
async function deleteAttachment(imageId) {
  if (!confirm('Delete this attachment?')) {
    return;
  }

  try {
    const response = await fetch(`/api/images/${imageId}`, { method: 'DELETE' });
    const result = await response.json();

    if (result.success) {
      // Reload the modal to show updated list
      openAttachmentModal(currentAttachmentCaseId);
      // Reload cases to update badge count
      loadCases(document.getElementById('searchInput').value);
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error deleting attachment:', error);
    alert('Error deleting attachment: ' + error.message);
  }
}

// Handle attachment file upload
document.getElementById('attachmentInput')?.addEventListener('change', async (e) => {
  const files = e.target.files;
  if (!files.length || !currentAttachmentCaseId) return;

  const formData = new FormData();
  for (const file of files) {
    formData.append('images', file);
  }

  const grid = document.getElementById('attachmentGrid');
  grid.innerHTML = '<p class="loading">Uploading...</p>';

  try {
    const response = await fetch(`/api/cases/${currentAttachmentCaseId}/images`, {
      method: 'POST',
      body: formData
    });
    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    // Reload modal to show new images
    openAttachmentModal(currentAttachmentCaseId);
    // Reload cases to update badge count
    loadCases(document.getElementById('searchInput').value);

  } catch (error) {
    console.error('Error uploading attachments:', error);
    alert('Error uploading: ' + error.message);
    openAttachmentModal(currentAttachmentCaseId);
  }

  // Clear input so same file can be selected again
  e.target.value = '';
});

// --------------------------------------------
// ACGME CSV Import
// --------------------------------------------
let parsedImportCases = [];

// Trigger file input
document.getElementById('importBtn')?.addEventListener('click', () => {
  document.getElementById('importFile').click();
});

// Handle file selection
document.getElementById('importFile')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const csvText = event.target.result;
    parseAcgmeCsv(csvText);
  };
  reader.readAsText(file);

  // Clear input so same file can be selected again
  e.target.value = '';
});

// Parse ACGME CSV format
function parseAcgmeCsv(csvText) {
  const lines = csvText.split('\n');
  if (lines.length < 2) {
    alert('CSV file appears to be empty or invalid.');
    return;
  }

  // Parse header row
  const headers = parseCsvLine(lines[0]);

  // Find column indices
  const colIndex = {
    ProcedureDate: headers.indexOf('ProcedureDate'),
    PatientSex: headers.indexOf('PatientSex'),
    CaseID: headers.indexOf('CaseID'),
    Code: headers.indexOf('Code'),
    CPTDesc: headers.indexOf('CPTDesc'),
    AttendingLName: headers.indexOf('AttendingLName'),
    AttendingFName: headers.indexOf('AttendingFName'),
    DefinedCategories: headers.indexOf('DefinedCategories'),
    PatientType: headers.indexOf('PatientType')
  };

  // Parse data rows
  parsedImportCases = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCsvLine(line);

    // Build case object
    const cptDesc = values[colIndex.CPTDesc] || '';
    const caseData = {
      date_of_surgery: formatAcgmeDate(values[colIndex.ProcedureDate] || ''),
      patient_mrn: values[colIndex.CaseID] || '',
      patient_gender: mapGender(values[colIndex.PatientSex] || ''),
      cpt_code: values[colIndex.Code] || '',
      procedure_name: cptDesc,
      cpt_inferred_note: cptDesc,  // Store CPT description for stats display
      attending_surgeon: formatAttending(
        values[colIndex.AttendingFName] || '',
        values[colIndex.AttendingLName] || ''
      ),
      case_category: mapAcgmeCategory(values[colIndex.DefinedCategories] || ''),
      patient_type: values[colIndex.PatientType] || '',
      submitted_to_acgme: true  // Mark as already submitted since it came from ACGME export
    };

    // Only include if we have at least some data
    if (caseData.date_of_surgery || caseData.patient_mrn || caseData.cpt_code) {
      parsedImportCases.push(caseData);
    }
  }

  // Show preview
  showImportPreview();
}

// Parse a single CSV line, handling quoted fields
function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

// Format ACGME date (M/D/YYYY or MM/DD/YYYY) to YYYY-MM-DD
function formatAcgmeDate(dateStr) {
  if (!dateStr) return '';

  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;

  const month = parts[0].padStart(2, '0');
  const day = parts[1].padStart(2, '0');
  const year = parts[2];

  return `${year}-${month}-${day}`;
}

// Map M/F to Male/Female
function mapGender(sex) {
  if (sex === 'M') return 'Male';
  if (sex === 'F') return 'Female';
  return '';
}

// Format attending name (just last name for consistency)
function formatAttending(firstName, lastName) {
  return lastName || '';
}

// Map ACGME category names to our format
function mapAcgmeCategory(acgmeCategory) {
  // Strip out ", Cranial: Vascular Total" suffix that ACGME adds to vascular cases
  let cleaned = acgmeCategory.replace(/, Cranial:\s*Vascular Total/gi, '').trim();

  // ACGME uses similar naming, some need minor adjustment
  const categoryMap = {
    'Cranial:  Tumor General': 'Cranial: Tumor General',
    'Cranial:  Tumor Sellar/Parasellar': 'Cranial: Tumor Sellar/Parasellar',
    'Cranial:  Trauma/Other': 'Cranial: Trauma/Other',
    'Cranial:  Vascular Open': 'Cranial: Vascular Open',
    'Cranial:  Vascular Endovascular': 'Cranial: Vascular Endovascular',
    'Cranial:  CSF Diversion/ETV/Other': 'Cranial: CSF Diversion/ETV/Other',
    'Cranial/Extracranial:  Pain': 'Cranial/Extracranial: Pain',
    'Cranial/Extracranial:  Functional Disorders': 'Cranial/Extracranial: Functional Disorders',
    'Cranial/Extracranial:  Epilepsy': 'Cranial/Extracranial: Epilepsy',
    'Spinal:  Anterior Cervical': 'Spinal: Anterior Cervical',
    'Spinal:  Posterior Cervical': 'Spinal: Posterior Cervical',
    'Spinal:  Thoracic/Lumbar/Sacral Instrumentation Fusion': 'Spinal: Thoracic/Lumbar/Sacral Instrumentation Fusion',
    'Spinal:  Lumbar Laminectomy/Laminotomy': 'Spinal: Lumbar Laminectomy/Laminotomy',
    'Spinal:  Stimulation/Lesion/Pump/Other': 'Spinal: Stimulation/Lesion/Pump/Other',
    'Peripheral Nerve': 'Peripheral Nerve',
    'Pediatric:  Cranial Tumor': 'Pediatric: Cranial Tumor',
    'Pediatric:  Cranial Trauma/Other': 'Pediatric: Cranial Trauma/Other',
    'Pediatric:  CSF Diversion/ETV/Other': 'Pediatric: CSF Diversion/ETV/Other',
    'Pediatric:  Spine': 'Pediatric: Spine'
  };

  // Try direct map first
  if (categoryMap[cleaned]) {
    return categoryMap[cleaned];
  }

  // Try normalizing (remove extra spaces)
  const normalized = cleaned.replace(/:\s+/g, ': ').trim();
  if (categoryMap[normalized]) {
    return categoryMap[normalized];
  }

  // Return cleaned version if no mapping found
  return normalized || cleaned;
}

// Show import preview table
function showImportPreview() {
  const preview = document.getElementById('importPreview');
  const summary = document.getElementById('importSummary');
  const tableContainer = document.getElementById('importTable');

  if (parsedImportCases.length === 0) {
    alert('No valid cases found in the CSV file.');
    return;
  }

  summary.textContent = `Found ${parsedImportCases.length} cases to import. These will be marked as already submitted to ACGME.`;

  // Build preview table
  const tableHtml = `
    <table class="import-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>MRN</th>
          <th>CPT</th>
          <th>Procedure</th>
          <th>Attending</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        ${parsedImportCases.slice(0, 50).map(c => `
          <tr>
            <td>${c.date_of_surgery || '-'}</td>
            <td>${c.patient_mrn || '-'}</td>
            <td>${c.cpt_code || '-'}</td>
            <td title="${c.procedure_name || ''}">${truncate(c.procedure_name, 40)}</td>
            <td>${c.attending_surgeon || '-'}</td>
            <td title="${c.case_category || ''}">${truncate(c.case_category, 25)}</td>
          </tr>
        `).join('')}
        ${parsedImportCases.length > 50 ? `
          <tr><td colspan="6" style="text-align: center; font-style: italic;">
            ... and ${parsedImportCases.length - 50} more cases
          </td></tr>
        ` : ''}
      </tbody>
    </table>
  `;

  tableContainer.innerHTML = tableHtml;
  preview.classList.remove('hidden');
}

// Confirm import
document.getElementById('confirmImport')?.addEventListener('click', async () => {
  if (parsedImportCases.length === 0) {
    alert('No cases to import.');
    return;
  }

  const confirmMsg = `Import ${parsedImportCases.length} cases?\n\nThese will be marked as already submitted to ACGME.`;
  if (!confirm(confirmMsg)) {
    return;
  }

  try {
    const response = await fetch('/api/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cases: parsedImportCases })
    });

    const result = await response.json();

    if (result.success) {
      const dupMsg = result.duplicates > 0 ? `\nDuplicates skipped: ${result.duplicates} (same MRN + date)` : '';
      const errMsg = result.skipped > 0 ? `\nErrors: ${result.skipped}` : '';
      alert(`✓ Import complete!\n\nImported: ${result.imported} cases${dupMsg}${errMsg}`);

      // Hide preview and reset
      document.getElementById('importPreview').classList.add('hidden');
      parsedImportCases = [];

      // Refresh stats if on stats tab
      if (document.getElementById('stats').classList.contains('active')) {
        loadStats();
      }
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Import error:', error);
    alert('Error importing cases: ' + error.message);
  }
});

// Cancel import
document.getElementById('cancelImport')?.addEventListener('click', () => {
  document.getElementById('importPreview').classList.add('hidden');
  parsedImportCases = [];
});
