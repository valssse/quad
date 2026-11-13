import { AnimatePresence, motion } from 'motion/react'
import Screen from '../components/Screen.jsx'
import Button from '../components/Button.jsx'
import Pagination from '../components/Pagination.jsx'
import { ease } from '../components/motion.js'
import bienvenidas from '../data/bienvenidas.js'
import ellipse from '../assets/icons/ellipse.svg'
import './Bienvenida.css'

/**
 * 01d · 01e · 01f — Bienvenida 1, 2 y 3.
 * Las tres comparten la misma estructura; solo cambia el contenido central,
 * que se desliza según la dirección. También se puede deslizar con el dedo.
 */
const slide = {
  enter: (dir) => ({ opacity: 0, x: dir >= 0 ? 32 : -32 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.42, ease } },
  exit: (dir) => ({ opacity: 0, x: dir >= 0 ? -32 : 32, transition: { duration: 0.2, ease } }),
}

export default function Bienvenida({ index, direction, onChange, onSkip, onFinish }) {
  const step = bienvenidas[index]
  const isLast = index === bienvenidas.length - 1

  const next = () => (isLast ? onFinish() : onChange(index + 1))
  const prev = () => index > 0 && onChange(index - 1)

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -60 || info.velocity.x < -400) next()
    else if (info.offset.x > 60 || info.velocity.x > 400) prev()
  }

  return (
    <Screen
      animateContent={false}
      animateActions
      topbar={
        <>
          <span />
          {/* En la Bienvenida 3 la barra superior queda vacía */}
          <AnimatePresence>
            {!isLast && (
              <motion.button
                type="button"
                className="link"
                onClick={onSkip}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Omitir
              </motion.button>
            )}
          </AnimatePresence>
        </>
      }
      actions={
        <Button onClick={next}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={step.cta}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              {step.cta}
            </motion.span>
          </AnimatePresence>
        </Button>
      }
    >
      <div className="welcome">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={index}
            className="welcome__slide"
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={handleDragEnd}
          >
            {/* Ilustración */}
            <div className="illustration" aria-hidden="true">
              <motion.img
                className="illustration__ellipse"
                src={ellipse}
                width="260"
                height="260"
                alt=""
                draggable="false"
                animate={{ scale: [1, 1.035, 1] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="illustration__bubble"
                initial={{ scale: 0.86, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.08 }}
              >
                <motion.img
                  src={step.icon}
                  width="64"
                  height="64"
                  alt=""
                  draggable="false"
                  initial={{ y: 6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.45, ease, delay: 0.16 }}
                />
              </motion.div>
            </div>

            {/* Encabezado */}
            <div className="heading heading--welcome">
              <motion.h1
                className="text-h1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, ease, delay: 0.12 }}
              >
                {step.title}
              </motion.h1>
              <motion.p
                className="text-p"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, ease, delay: 0.18 }}
              >
                {step.text}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease, delay: 0.3 }}
        >
          <Pagination total={bienvenidas.length} current={index} />
        </motion.div>
      </div>
    </Screen>
  )
}
